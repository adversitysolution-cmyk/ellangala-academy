// Run: node server/lib/razorpay.test.js
import crypto from 'crypto';
import assert from 'node:assert/strict';
import { verifyPaymentSignature } from './razorpay.js';

const secret = 'test_secret';
const razorpayOrderId = 'order_ABC123';
const razorpayPaymentId = 'pay_XYZ789';
const goodSig = crypto.createHmac('sha256', secret)
  .update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex');

// Valid signature passes
assert.equal(verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature: goodSig, secret }), true);

// Tampered payment id fails
assert.equal(verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId: 'pay_OTHER', signature: goodSig, secret }), false);

// Wrong secret fails
assert.equal(verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature: goodSig, secret: 'nope' }), false);

// Garbage / wrong-length signature fails without throwing
assert.equal(verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature: 'abc', secret }), false);

// Missing fields fail
assert.equal(verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature: '', secret }), false);

console.log('ok');
