import crypto from 'crypto';

// Verifies the signature Razorpay Checkout returns to the browser.
// https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/#step-4-verify-payment-signature
export function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature, secret }) {
  if (!razorpayOrderId || !razorpayPaymentId || !signature || !secret) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  return (
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  );
}
