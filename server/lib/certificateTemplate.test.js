// Run: node server/lib/certificateTemplate.test.js
import assert from 'node:assert/strict';
import { buildCertificateVars, renderTemplate } from './certificateTemplate.js';

const event = {
  title: 'Bhagavadgita for Meaningful Life',
  date: '2026-08-18',
  endDate: '2026-09-02',
  category: 'Positive Workshop',
  mode: 'Offline',
  venue: 'Ellangala’s Academy',
  city: 'Bengaluru',
  organizer: 'Ellangala’s Academy'
};
const certificate = {
  participantName: 'Rahul Kumar',
  participantEmail: 'rahul@gmail.com',
  certificateNumber: 'ELA-BML-2026-000147',
  issuedAt: '2026-09-05T10:00:00Z'
};
const vars = buildCertificateVars({
  certificate, event, template: { organizationName: 'Ellangala’s Academy' },
  verificationUrl: 'https://x.test/verify/c/abc'
});

assert.equal(vars.participant_name, 'Rahul Kumar');
assert.equal(vars.event_name, 'Bhagavadgita for Meaningful Life');
assert.equal(vars.event_date_text, 'held from 18-08-2026 to 02-09-2026');
assert.equal(vars.start_date, '18-08-2026');
assert.equal(vars.end_date, '02-09-2026');
assert.equal(vars.certificate_id, 'ELA-BML-2026-000147');

const out = renderTemplate(
  'This certifies that {{participant_name}} completed "{{event_name}}", {{event_date_text}}. ID: {{certificate_id}} {{unknown_token}}',
  vars
);
assert.equal(
  out,
  'This certifies that Rahul Kumar completed "Bhagavadgita for Meaningful Life", held from 18-08-2026 to 02-09-2026. ID: ELA-BML-2026-000147 '
);

// single-day event
const oneDay = buildCertificateVars({ certificate, event: { ...event, endDate: null }, template: {}, verificationUrl: '' });
assert.equal(oneDay.event_date_text, 'held on 18-08-2026');

console.log('certificateTemplate.test.js OK');
