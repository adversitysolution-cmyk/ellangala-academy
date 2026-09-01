// Run: node server/lib/participantPipeline.test.js
import assert from 'node:assert/strict';
import { classifyParticipants, countByStatus } from './participantPipeline.js';

const rawRows = [
  { 'Full Name': 'Rahul Kumar', 'Email Address': 'rahul@gmail.com', 'Mobile Number': '9876543210' },
  { 'Full Name': 'Priya Rao', 'Email Address': 'PRIYA@gmail.com', 'Mobile Number': '' },
  { 'Full Name': 'Arun', 'Email Address': 'invalid-email', 'Mobile Number': '' },
  { 'Full Name': 'Sneha Rao', 'Email Address': 'sneha@gmail.com', 'Mobile Number': '' },
  { 'Full Name': 'Rahul K', 'Email Address': 'rahul@gmail.com', 'Mobile Number': '' }, // dup email
  { 'Full Name': 'Old Grad', 'Email Address': 'old@gmail.com', 'Mobile Number': '' }
];
const mapping = { name: 'Full Name', email: 'Email Address', phone: 'Mobile Number' };
const registrations = [
  { id: 'ENR-1', email: 'rahul@gmail.com', phone: '' },
  { id: 'ENR-2', email: 'priya@gmail.com', phone: '' },
  { id: 'ENR-3', email: 'old@gmail.com', phone: '' }
];

const { participants, counts } = classifyParticipants({
  rawRows, mapping, requireRegistrationMatch: true,
  registrations, existingCertificateEmails: ['old@gmail.com']
});

assert.equal(participants[0].status, 'READY');
assert.equal(participants[0].registrationId, 'ENR-1');
assert.equal(participants[0].eligible, true);
assert.equal(participants[1].status, 'READY'); // priya matched
assert.equal(participants[2].status, 'INVALID');
assert.equal(participants[3].status, 'UNMATCHED'); // sneha not registered
assert.equal(participants[4].status, 'DUPLICATE');
assert.equal(participants[5].status, 'ALREADY_CERTIFIED');
assert.equal(counts.READY, 2);
assert.equal(counts.INVALID, 1);
assert.equal(counts.UNMATCHED, 1);
assert.equal(counts.DUPLICATE, 1);
assert.equal(counts.ALREADY_CERTIFIED, 1);

// requireRegistrationMatch OFF -> unmatched becomes READY
const off = classifyParticipants({ rawRows, mapping, requireRegistrationMatch: false, registrations: [], existingCertificateEmails: [] });
assert.equal(off.participants[3].status, 'READY');
assert.equal(off.participants[2].status, 'INVALID');

assert.equal(countByStatus(participants).total, 6);
console.log('participantPipeline.test.js OK');
