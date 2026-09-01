// Run: node server/lib/certificateDates.test.js
import assert from 'node:assert/strict';
import { formatCertDate, formatEventDateText } from './certificateDates.js';

assert.equal(formatCertDate('2026-08-18'), '18-08-2026');
assert.equal(formatCertDate('18-08-2026'), '18-08-2026');
assert.equal(formatCertDate(new Date('2026-09-02T00:00:00Z')), '02-09-2026');
assert.equal(formatCertDate(''), '');

// spec examples
assert.equal(formatEventDateText('18-08-2026', '18-08-2026'), 'held on 18-08-2026');
assert.equal(formatEventDateText('18-08-2026', ''), 'held on 18-08-2026');
assert.equal(formatEventDateText('2026-08-18', null), 'held on 18-08-2026');
assert.equal(formatEventDateText('18-08-2026', '02-09-2026'), 'held from 18-08-2026 to 02-09-2026');
assert.equal(formatEventDateText('2026-08-18', '2026-09-02'), 'held from 18-08-2026 to 02-09-2026');

console.log('certificateDates.test.js OK');
