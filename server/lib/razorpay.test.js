// Run: node server/lib/razorpay.test.js
import crypto from 'crypto';
import assert from 'node:assert/strict';
import { verifyPaymentSignature, verifyWebhookSignature } from './razorpay.js';

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

// Webhook signature
const body = Buffer.from('{"event":"payment.captured"}');
const whSig = crypto.createHmac('sha256', 'whsec').update(body).digest('hex');
assert.equal(verifyWebhookSignature({ rawBody: body, signature: whSig, secret: 'whsec' }), true);
assert.equal(verifyWebhookSignature({ rawBody: Buffer.from('{}'), signature: whSig, secret: 'whsec' }), false);
assert.equal(verifyWebhookSignature({ rawBody: body, signature: whSig, secret: '' }), false);

console.log('ok');
