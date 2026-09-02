import fs from 'fs';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { renderTemplate } from './certificateTemplate.js';

const GOLD = '#CA8A38';
const NAVY = '#0A2347';
const INK = '#1E293B';

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
// The uploaded background IS the finished design (borders, headings, body text,
// signature — everything static). We only stamp the participant name, the QR and
// the certificate id on top. All positions are in PDF points and tunable per
// template via `overlayConfig`, because the exact spot only lines up after
// eyeballing a real render — see docs/CERTIFICATES.md.
// ponytail: coordinates are calibration knobs, not constants — the physical
// layout of a hand-made design can't be derived, only tuned.
const DEFAULT_OVERLAY = {
  orientation: 'portrait',
  name:   { x: 336, y: 466, width: 210, size: 15, color: NAVY, font: 'Times-Bold', align: 'center' },
  certId: { x: 48,  y: 800, width: 500, size: 7.5, color: '#666666', font: 'Helvetica', align: 'center' },
  qr:     { x: 246, y: 612, size: 72 }
};

function mergeOverlay(cfg = {}) {
  return {
    orientation: cfg.orientation || DEFAULT_OVERLAY.orientation,
    name: { ...DEFAULT_OVERLAY.name, ...(cfg.name || {}) },
    certId: { ...DEFAULT_OVERLAY.certId, ...(cfg.certId || {}) },
    qr: { ...DEFAULT_OVERLAY.qr, ...(cfg.qr || {}) }
  };
}

async function renderOverlay({ template, vars, assets }) {
  const cfg = mergeOverlay(template.overlayConfig || {});
  const doc = new PDFDocument({
    size: 'A4', layout: cfg.orientation === 'landscape' ? 'landscape' : 'portrait', margin: 0
  });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  const W = doc.page.width;
  const H = doc.page.height;
  safeImage(doc, assets.backgroundPath, 0, 0, { width: W, height: H });

  const { name, certId, qr } = cfg;

  if (name.size > 0 && vars.participant_name) {
    doc.font(name.font || 'Times-Bold').fontSize(name.size).fillColor(name.color || NAVY)
      .text(vars.participant_name, name.x, name.y, {
        width: name.width, align: name.align || 'center', lineBreak: false
      });
  }

  if (qr.size > 0) {
    doc.image(await qrBuffer(vars.verification_url || vars.certificate_id), qr.x, qr.y,
      { width: qr.size, height: qr.size });
  }

  if (certId.size > 0) {
    const verifyHost = (vars.verification_url || '').replace(/^https?:\/\//, '').replace(/\?.*$/, '');
    const line = [
      vars.certificate_id && `Certificate No: ${vars.certificate_id}`,
      verifyHost && `Verify at ${verifyHost}`
    ].filter(Boolean).join('      ·      ');
    doc.font(certId.font || 'Helvetica').fontSize(certId.size).fillColor(certId.color || '#666666')
      .text(line, certId.x, certId.y, { width: certId.width, align: certId.align || 'center', lineBreak: false });
  }

  doc.end();
  return done;
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
