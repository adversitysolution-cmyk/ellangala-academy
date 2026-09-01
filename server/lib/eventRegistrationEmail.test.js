// Run: node server/lib/eventRegistrationEmail.test.js
import assert from 'node:assert/strict';
import { buildRegistrationEmail } from './eventRegistrationEmail.js';

const enrollment = { fullName: 'Asha', email: 'asha@example.com' };

// Online event with a Meet link -> link appears
let mail = buildRegistrationEmail(enrollment, {
  title: 'Mind Workshop', date: '2026-09-10', startTime: '18:00', endTime: '19:30',
  mode: 'Online', googleMeetLink: 'https://meet.google.com/abc-defg-hij', speaker: 'Dr. R'
});
assert.match(mail.text, /Google Meet link: https:\/\/meet\.google\.com\/abc-defg-hij/);
assert.match(mail.text, /Where: Online/);
assert.equal(mail.to, 'asha@example.com');

// In-person event, no Meet link -> no Meet line, venue shown
mail = buildRegistrationEmail(enrollment, {
  title: 'Parenting Circle', date: '2026-09-12', startTime: '10:00', endTime: '12:00',
  mode: 'Offline', venue: 'Community Hall', city: 'Bengaluru'
});
assert.doesNotMatch(mail.text, /Google Meet link/);
assert.match(mail.text, /Where: Community Hall, Bengaluru/);

console.log('ok');
