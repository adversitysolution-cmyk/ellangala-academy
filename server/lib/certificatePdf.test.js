// Run: node server/lib/certificatePdf.test.js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { renderCertificatePdf } from './certificatePdf.js';

const pdf = await renderCertificatePdf({
  template: {
    organizationName: 'Ellangala’s Academy',
    headingText: 'Certificate of Completion',
    signatoryName: 'Dr. Naveen Ellangala',
    signatoryTitle: 'Founder',
    bodyText: 'This is to certify that {{participant_name}} completed "{{event_name}}", {{event_date_text}}.'
  },
  vars: {
    participant_name: 'Rahul Kumar',
    event_name: 'Bhagavadgita for Meaningful Life',
    event_date_text: 'held from 18-08-2026 to 02-09-2026',
    certificate_id: 'ELA-BML-2026-000147',
    verification_url: 'https://x.test/verify/c/abc123'
  }
});

assert.ok(Buffer.isBuffer(pdf));
assert.ok(pdf.length > 1000, 'pdf should have real content');
assert.equal(pdf.slice(0, 5).toString(), '%PDF-');

// overlay mode: no background path -> must fall back to the classic layout, not crash
const fallback = await renderCertificatePdf({
  template: { renderMode: 'overlay', overlayConfig: { name: { y: 400 } } },
  vars: { participant_name: 'A B', certificate_id: 'X-1', verification_url: 'https://x.test/v' }
});
assert.equal(fallback.slice(0, 5).toString(), '%PDF-', 'overlay without background falls back');

// overlay mode with a real 1x1 PNG background -> valid PDF
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);
const bg = path.join(os.tmpdir(), `certbg-${Date.now()}.png`);
fs.writeFileSync(bg, png);
const overlay = await renderCertificatePdf({
  template: { renderMode: 'overlay', overlayConfig: { qr: { size: 0 } } }, // size 0 skips the QR
  vars: { participant_name: 'Priya K', certificate_id: 'ELA-1', verification_url: 'https://x.test/v?id=1' },
  assets: { backgroundPath: bg }
});
fs.unlinkSync(bg);
assert.equal(overlay.slice(0, 5).toString(), '%PDF-', 'overlay with background renders');

console.log('certificatePdf.test.js OK', pdf.length, 'bytes (classic + overlay)');
