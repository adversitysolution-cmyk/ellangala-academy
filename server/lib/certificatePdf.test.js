// Run: node server/lib/certificatePdf.test.js
import assert from 'node:assert/strict';
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

console.log('certificatePdf.test.js OK', pdf.length, 'bytes');
