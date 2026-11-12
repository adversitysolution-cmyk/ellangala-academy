import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCommunityAuthLookup } from '../db/communityStore.js';

test('buildCommunityAuthLookup never uses wildcard LIKE for name logins', () => {
  const nameLookup = buildCommunityAuthLookup('Naveen');
  assert.equal(nameLookup.sql.includes('LIKE'), false);
  assert.deepEqual(nameLookup.params, ['Naveen']);

  const nameWithSmallDigits = buildCommunityAuthLookup('Seeker 123');
  assert.equal(nameWithSmallDigits.sql.includes('LIKE'), false);
  assert.deepEqual(nameWithSmallDigits.params, ['Seeker 123']);

  const phoneLookup = buildCommunityAuthLookup('+91 98765 43210');
  assert.equal(phoneLookup.sql.includes('LIMIT 1'), false);
  assert.match(phoneLookup.sql, /phone LIKE \?/);
  assert.deepEqual(phoneLookup.params, ['919876543210', '%76543210', '+91 98765 43210']);
});
