// Run: node src/shared/couponMath.test.js
import assert from 'node:assert/strict';
import { computeDiscount, checkCouponUsable } from './couponMath.js';

// percent
assert.equal(computeDiscount({ type: 'percent', value: 10 }, 500), 50);
// percent with cap
assert.equal(computeDiscount({ type: 'percent', value: 20, maxDiscount: 100 }, 1000), 100);
// fixed
assert.equal(computeDiscount({ type: 'fixed', value: 150 }, 500), 150);
// fixed never exceeds subtotal
assert.equal(computeDiscount({ type: 'fixed', value: 999 }, 300), 300);
// below minimum -> no discount
assert.equal(computeDiscount({ type: 'percent', value: 10, minSubtotal: 600 }, 500), 0);
// no coupon
assert.equal(computeDiscount(null, 500), 0);

// usable checks
assert.equal(checkCouponUsable({ active: true }).ok, true);
assert.equal(checkCouponUsable({ active: false }).ok, false);
assert.equal(checkCouponUsable(null).ok, false);
assert.equal(checkCouponUsable({ active: true, usageLimit: 5, usedCount: 5 }).ok, false);
assert.equal(
  checkCouponUsable({ active: true, expiresAt: '2020-01-01' }, new Date('2026-01-01')).ok,
  false
);
assert.equal(
  checkCouponUsable({ active: true, expiresAt: '2026-09-01' }, new Date('2026-09-01T10:00:00')).ok,
  true
);

console.log('ok');
