import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { PDFDocument as PDFLibDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { renderTemplate } from './certificateTemplate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GOLD = '#CA8A38';
const NAVY = '#0A2347';
const INK = '#1E293B';

// Bundled calligraphy face for overlay body text (Parisienne, OFL).
const SCRIPT_FONT_PATH = path.join(__dirname, 'fonts', 'Parisienne.ttf');

function hexRgb(hex, fallback = [0, 0, 0]) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  const [r, g, b] = m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : fallback;
  return rgb(r / 255, g / 255, b / 255);
}

function safeImage(doc, path, ...args) {
  try {
    if (path && fs.existsSync(path)) doc.image(path, ...args);
  } catch { /* a missing/corrupt asset must not fail the whole batch */ }
}

async function qrBuffer(data) {
  return QRCode.toBuffer(data || 'certificate', {
    type: 'png', margin: 1, width: 320, errorCorrectionLevel: 'M'
  });
}

// Renders one certificate to a PDF Buffer.
// `template` carries the static design/content; `vars` the dynamic values.
// `assets` are optional absolute filesystem paths.
export async function renderCertificatePdf({ template, vars, assets = {} }) {
  if (template?.renderMode === 'overlay' && assets.backgroundPath) {
    return renderOverlay({ template, vars, assets });
  }
  return renderClassic({ template, vars, assets });
}

// --- Overlay mode -----------------------------------------------------------
// The uploaded background is a BLANK version of the design (frame, logos,
// headings, the "Mr./Ms." line, signature — everything that never changes).
// Everything event-specific is stamped on top: participant name, the body
// sentence (event title + dates, from {{placeholders}}), the QR and the
// certificate number. Positions are PDF points, tunable per template via
// `overlayConfig`; a field with size 0 is skipped, a blank field uses the
// default below.
// ponytail: coordinates are calibration knobs, not constants — the physical
// layout of a hand-made design can't be derived, only tuned against a render.
// The body sentence is up to four stacked, centred, calligraphy lines:
//   pre   — dark ink            "has successfully completed the"
//   title — gold, its own line  "“{{event_name}}”"
//   mid   — dark ink            "course at {{organization_name}},"
//   post  — dark ink            "{{event_date_text}}."
// Any part left blank is skipped. `{{...}}` placeholders are filled from vars.
// All coordinates below are top-left PDF points (y grows downward), the same
// mental model as the design tool; renderOverlay converts to pdf-lib's
// bottom-left space. `erase` paints a rectangle before stamping — use it only
// when the uploaded background still has the old body text baked in; match the
// paper colour exactly. With a truly blank background, leave `erase` unset.
const DEFAULT_OVERLAY = {
  name:   { x: 300, y: 450, size: 17, color: NAVY, font: 'bold' },
  body:   {
    x: 78, y: 506, width: 440, size: 16, lineGap: 6,
    color: '#2E2A24', accentColor: '#A9741F',
    pre: 'has successfully completed the',
    title: '“{{event_name}}”',
    mid: 'course at {{organization_name}},',
    post: '{{event_date_text}}.'
  },
  certId: { x: 219, y: 664, width: 164, size: 8, color: '#555555' },
  qr:     { x: 275, y: 600, size: 52 },
  erase:  null // { x, y, width, height, color } — only for a still-filled design
};

function mergeOverlay(cfg = {}) {
  return {
    name: { ...DEFAULT_OVERLAY.name, ...(cfg.name || {}) },
    body: { ...DEFAULT_OVERLAY.body, ...(cfg.body || {}) },
    certId: { ...DEFAULT_OVERLAY.certId, ...(cfg.certId || {}) },
    qr: { ...DEFAULT_OVERLAY.qr, ...(cfg.qr || {}) },
    erase: cfg.erase || DEFAULT_OVERLAY.erase
  };
}

// Overlays the dynamic fields onto the background using pdf-lib, so a PDF
// background stays vector-perfect (no rasterisation, no clipped border).
async function renderOverlay({ template, vars, assets }) {
  const cfg = mergeOverlay(template.overlayConfig || {});
  const bg = fs.readFileSync(assets.backgroundPath);
  const isPdf = bg.slice(0, 5).toString() === '%PDF-';

  let pdf, page;
  if (isPdf) {
    pdf = await PDFLibDocument.load(bg);
    page = pdf.getPage(0);
  } else {
    pdf = await PDFLibDocument.create();
    const img = assets.backgroundPath.toLowerCase().endsWith('.jpg') || assets.backgroundPath.toLowerCase().endsWith('.jpeg')
      ? await pdf.embedJpg(bg) : await pdf.embedPng(bg);
    page = pdf.addPage([595.28, 841.89]);
    page.drawImage(img, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
  }
  pdf.registerFontkit(fontkit);

  const PW = page.getWidth();
  const PH = page.getHeight();
  const topY = (y, size = 0) => PH - y - size; // top-left point -> pdf-lib baseline-ish

  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  let script = bold;
  try {
    if (fs.existsSync(SCRIPT_FONT_PATH)) script = await pdf.embedFont(fs.readFileSync(SCRIPT_FONT_PATH), { subset: true });
  } catch { /* keep bold fallback */ }

  const drawCentred = (text, font, size, color, boxX, boxW, yTop, faux = 0) => {
    if (!text) return;
    const w = font.widthOfTextAtSize(text, size);
    const x = boxX + (boxW - w) / 2;
    const y = topY(yTop, size);
    // faux-bold: a couple of hairline-offset passes thicken a single-weight face
    const offs = faux ? [[0, 0], [faux, 0], [0, faux], [faux, faux]] : [[0, 0]];
    for (const [dx, dy] of offs) page.drawText(text, { x: x + dx, y: y + dy, size, font, color });
  };

  const { name, body, certId, qr, erase } = cfg;

  if (erase && erase.width && erase.height) {
    page.drawRectangle({
      x: erase.x, y: PH - erase.y - erase.height, width: erase.width, height: erase.height,
      color: hexRgb(erase.color, [251, 252, 251])
    });
  }

  if (name.size > 0 && vars.participant_name) {
    const font = name.font === 'script' ? script : bold;
    page.drawText(vars.participant_name, {
      x: name.x, y: topY(name.y, name.size), size: name.size, font, color: hexRgb(name.color, [10, 35, 71])
    });
  }

  if (body.size > 0) {
    const gap = (body.lineGap ?? 5) + body.size;
    let y = body.y;
    const ink = hexRgb(body.color, [46, 42, 36]);
    const gold = hexRgb(body.accentColor, [169, 116, 31]);
    const put = (raw, color, faux = 0) => {
      const t = renderTemplate(raw, vars).trim();
      if (!t) return;
      drawCentred(t, script, body.size, color, body.x, body.width, y, faux);
      y += gap;
    };
    if (body.text) put(body.text, ink);
    else {
      put(body.pre, ink);
      put(body.title, gold, body.titleBold ?? 0.4); // programme name reads bolder, like the design
      put(body.mid, ink);
      put(body.post, ink);
    }
  }

  if (qr.size > 0) {
    const png = await pdf.embedPng(await qrBuffer(vars.verification_url || vars.certificate_id));
    page.drawImage(png, { x: qr.x, y: PH - qr.y - qr.size, width: qr.size, height: qr.size });
  }

  if (certId.size > 0 && vars.certificate_id) {
    drawCentred(vars.certificate_id, helv, certId.size, hexRgb(certId.color, [85, 85, 85]),
      certId.x, certId.width, certId.y);
  }

  return Buffer.from(await pdf.save());
}

// --- Classic mode (generated layout) --------------------------------------
async function renderClassic({ template, vars, assets }) {
  const qrPng = await qrBuffer(vars.verification_url || vars.certificate_id);

  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  const W = doc.page.width;
  const H = doc.page.height;

  if (assets.backgroundPath) safeImage(doc, assets.backgroundPath, 0, 0, { width: W, height: H });
  else doc.rect(0, 0, W, H).fill('#FFFDF8');

  // decorative border
  doc.lineWidth(3).strokeColor(GOLD).rect(24, 24, W - 48, H - 48).stroke();
  doc.lineWidth(1).strokeColor(NAVY).rect(32, 32, W - 64, H - 64).stroke();

  const cx = W / 2;

  if (assets.logoPath) safeImage(doc, assets.logoPath, cx - 45, 54, { fit: [90, 70], align: 'center' });

  doc.fillColor(NAVY).font('Helvetica-Bold').fontSize(26)
    .text(template.organizationName || 'Ellangala’s Academy', 0, 132, { align: 'center' });
  if (template.address) {
    doc.font('Helvetica').fontSize(10).fillColor(INK)
      .text(template.address, 0, 164, { align: 'center' });
  }

  doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(30)
    .text((template.headingText || 'Certificate of Completion').toUpperCase(), 0, 200, {
      align: 'center', characterSpacing: 2
    });

  const body = renderTemplate(
    template.bodyText ||
      'This is to certify that {{participant_name}} has successfully completed "{{event_name}}" at {{organization_name}}, {{event_date_text}}.',
    vars
  );
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(15).fillColor(INK)
    .text(body, 90, 260, { width: W - 180, align: 'center', lineGap: 6 });

  // signature + seal row
  const rowY = H - 150;
  safeImage(doc, assets.signaturePath, 90, rowY - 40, { fit: [150, 45] });
  doc.moveTo(90, rowY).lineTo(260, rowY).strokeColor(INK).lineWidth(0.8).stroke();
  doc.font('Helvetica-Bold').fontSize(11).fillColor(NAVY)
    .text(template.signatoryName || 'Dr. Naveen Ellangala', 90, rowY + 6, { width: 180 });
  doc.font('Helvetica').fontSize(9).fillColor(INK)
    .text(template.signatoryTitle || 'Founder', 90, rowY + 20, { width: 180 });
  safeImage(doc, assets.sealPath, cx - 40, rowY - 50, { fit: [80, 80] });

  // QR + certificate id (bottom-right)
  const qrSize = 96;
  doc.image(qrPng, W - 90 - qrSize, rowY - 46, { width: qrSize, height: qrSize });
  doc.font('Helvetica-Bold').fontSize(9).fillColor(NAVY)
    .text(`Certificate ID: ${vars.certificate_id}`, W - 300, rowY + 58, { width: 240, align: 'right' });
  doc.font('Helvetica').fontSize(7.5).fillColor(INK)
    .text(`Verify at ${vars.verification_url}`, W - 300, rowY + 72, { width: 240, align: 'right' });

  doc.end();
  return done;
}
