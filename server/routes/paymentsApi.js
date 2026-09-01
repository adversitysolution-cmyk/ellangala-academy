import { getDbOrderById, setDbOrderPaymentRef, markDbOrderPaid } from '../db/store.js';
import { asyncRouter } from '../lib/asyncRouter.js';
import { verifyPaymentSignature } from '../lib/razorpay.js';

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

function rzpAuthHeader() {
  return 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
}

const router = asyncRouter();

// Public: POST /api/payments/razorpay/order
// Body: { orderId }. Creates a Razorpay order for our order's total and returns
// what the browser needs to open Razorpay Checkout.
router.post('/payments/razorpay/order', async (req, res) => {
  if (!KEY_ID || !KEY_SECRET) {
    return res.status(503).json({ error: 'Online payment is not configured.' });
  }

  const order = await getDbOrderById((req.body?.orderId || '').trim());
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  if (order.paymentStatus === 'Paid') {
    return res.status(409).json({ error: 'This order is already paid.' });
  }

  const amountPaise = Math.round(Number(order.totalAmount) * 100);
  if (!amountPaise || amountPaise < 100) {
    return res.status(400).json({ error: 'Order total is too low for online payment.' });
  }

  const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: rzpAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt: order.id })
  });
  const rzpOrder = await rzpRes.json();
  if (!rzpRes.ok || !rzpOrder.id) {
    console.error('Razorpay order create failed:', rzpOrder);
    return res.status(502).json({ error: 'Could not start the payment. Please try again.' });
  }

  await setDbOrderPaymentRef(order.id, rzpOrder.id);

  res.json({
    keyId: KEY_ID,
    razorpayOrderId: rzpOrder.id,
    amount: amountPaise,
    currency: 'INR',
    orderId: order.id,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone
  });
});

// Public: POST /api/payments/razorpay/verify
// Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
router.post('/payments/razorpay/verify', async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment confirmation fields.' });
  }

  const order = await getDbOrderById(String(orderId).trim());
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  // The Razorpay order must be the one we opened checkout with for THIS order.
  if (order.paymentRef !== razorpay_order_id) {
    return res.status(400).json({ error: 'Payment does not match this order.' });
  }

  const sigOk = verifyPaymentSignature({
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    signature: razorpay_signature,
    secret: KEY_SECRET
  });
  if (!sigOk) {
    return res.status(400).json({ error: 'Payment signature verification failed.' });
  }

  const updated = await markDbOrderPaid(order.id, `${razorpay_order_id}|${razorpay_payment_id}`);
  res.json({ verified: true, order: updated });
});

export default router;
