// Run: node server/lib/certificateId.test.js
import assert from 'node:assert/strict';
import { deriveEventCode, buildCertificateNumber, generateVerificationToken } from './certificateId.js';

assert.equal(deriveEventCode({ title: 'Bhagavadgita for Meaningful Life' }), 'BML');
assert.equal(deriveEventCode({ title: 'Positive Parenting Workshop' }), 'PPW');
assert.equal(deriveEventCode({ title: '', id: 'EVT-2026-0009' }), '009');

assert.equal(
  buildCertificateNumber({ org: 'ELA', eventCode: 'BML', year: 2026, sequence: 1 }),
  'ELA-BML-2026-000001'
);
assert.equal(
  buildCertificateNumber({ format: '{event}/{year}/{seq}', eventCode: 'BML', year: 2026, sequence: 147 }),
  'BML/2026/000147'
);

const t1 = generateVerificationToken();
assert.match(t1, /^[a-f0-9]{48}$/);
assert.notEqual(t1, generateVerificationToken());

console.log('certificateId.test.js OK');
