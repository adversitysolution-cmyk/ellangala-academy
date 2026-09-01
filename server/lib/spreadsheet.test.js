// Run: node server/lib/spreadsheet.test.js
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import { parseSheet, autoDetectMapping } from './spreadsheet.js';
import {
  mapRow, validateParticipant, markDuplicates, matchRegistration, normalizePhone
} from './participantValidation.js';

function xlsxBuffer(aoa) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'Sheet1');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

// --- XLSX parse + auto-map (Google Form style headers) ---
const buf = xlsxBuffer([
  ['Timestamp', 'Full Name', 'Email Address', 'Mobile Number', 'College'],
  ['2026/09/01', '  Rahul   Kumar ', 'RAHUL@Gmail.com', '+91 98765 43210', 'ABC'],
  ['2026/09/01', 'Priya Rao', 'priya@gmail.com', '9876500000', 'XYZ'],
  ['', '', '', '', ''], // empty row dropped
  ['2026/09/01', 'Arun', 'invalid-email', '', 'PQR'],
  ['2026/09/01', 'Rahul Kumar', 'rahul@gmail.com', '', 'DEF'] // dup email
]);
const { headers, rows } = parseSheet(buf);
assert.deepEqual(headers, ['Timestamp', 'Full Name', 'Email Address', 'Mobile Number', 'College']);
assert.equal(rows.length, 4);

const mapping = autoDetectMapping(headers);
assert.deepEqual(mapping, { name: 'Full Name', email: 'Email Address', phone: 'Mobile Number' });

// --- CSV parse ---
const csv = parseSheet(Buffer.from('Name,E-mail,Phone\nSam,sam@x.com,123\n', 'utf-8'));
assert.deepEqual(csv.headers, ['Name', 'E-mail', 'Phone']);
assert.deepEqual(autoDetectMapping(csv.headers), { name: 'Name', email: 'E-mail', phone: 'Phone' });

// --- missing required columns ---
assert.equal(autoDetectMapping(['Foo', 'Bar']).email, '');

// --- normalize + validate ---
const mapped = rows.map((r) => mapRow(r, mapping));
assert.equal(mapped[0].name, 'Rahul Kumar');
assert.equal(mapped[0].email, 'rahul@gmail.com');
assert.equal(mapped[0].phone, '9876543210');
assert.deepEqual(validateParticipant(mapped[0], {}).errors, []);
assert.deepEqual(validateParticipant(mapped[2], {}).errors, ['Invalid email address']);
assert.deepEqual(validateParticipant({ name: '', email: '' }, {}).errors, ['Name is required', 'Email is required']);
assert.deepEqual(validateParticipant(mapped[1], { phoneRequired: true }).errors, []);
assert.deepEqual(validateParticipant({ name: 'A', email: 'a@b.com', phone: '' }, { phoneRequired: true }).errors, ['Phone is required']);

// --- duplicates within file ---
const dupd = markDuplicates(mapped);
assert.equal(dupd[0].duplicate, false);
assert.equal(dupd[3].duplicate, true); // second rahul@gmail.com

// --- registration matching (email primary, phone secondary, not name) ---
assert.equal(normalizePhone('+91 98765-43210'), '9876543210');
const byEmail = new Map([['rahul@gmail.com', { id: 'ENR-1' }]]);
const byPhone = new Map([['9876500000', { id: 'ENR-2' }]]);
assert.deepEqual(matchRegistration({ email: 'rahul@gmail.com', phone: '' }, byEmail, byPhone), { id: 'ENR-1' });
assert.deepEqual(matchRegistration({ email: 'nope@x.com', phone: '9876500000' }, byEmail, byPhone), { id: 'ENR-2' });
assert.equal(matchRegistration({ email: 'nope@x.com', phone: '' }, byEmail, byPhone), null);

console.log('spreadsheet.test.js OK');
