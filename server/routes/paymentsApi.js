import {
  getDbOrderById, setDbOrderPaymentRef, markDbOrderPaid,
  getDbOrderByPaymentRef, getDbEnrollmentByPaymentRef, getDbEnrollmentById, setDbEnrollmentPaymentRef, markDbEnrollmentPaid
} from '../db/store.js';
import { sendEventRegistrationEmail } from './enrollmentsApi.js';
import { asyncRouter } from '../lib/asyncRouter.js';
import { verifyPaymentSignature, verifyWebhookSignature } from '../lib/razorpay.js';

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

function rzpAuthHeader() {
  return 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
}

// What can be paid for: book orders, or paid-event registrations (enrollments).
const targets = {
  order: {
    idField: 'orderId',
    label: 'Order',
    get: getDbOrderById,
    amount: (o) => Number(o.totalAmount),
    isPaid: (o) => o.paymentStatus === 'Paid',
    setRef: setDbOrderPaymentRef,
    markPaid: markDbOrderPaid,
    prefill: (o) => ({ customerName: o.customerName, email: o.email, phone: o.phone })
  },
  enrollment: {
    idField: 'enrollmentId',
    label: 'Registration',
    get: getDbEnrollmentById,
    amount: (e) => Number(e.amount),
    isPaid: (e) => e.paymentStatus === 'Paid',
    setRef: setDbEnrollmentPaymentRef,
    markPaid: async (id, ref) => {
      const paid = await markDbEnrollmentPaid(id, ref);
      sendEventRegistrationEmail(paid).catch(err =>
        console.error('Failed to send event registration email:', err.message)
      );
      return paid;
    },
    prefill: (e) => ({ customerName: e.fullName, email: e.email, phone: e.phone })
  }
};
const pickTarget = (body) => (body?.enrollmentId ? 'enrollment' : 'order');

const router = asyncRouter();

// Public: POST /api/payments/razorpay/order
// Body: { orderId }. Creates a Razorpay order for our order's total and returns
// what the browser needs to open Razorpay Checkout.
router.post('/payments/razorpay/order', async (req, res) => {
  if (!KEY_ID || !KEY_SECRET) {
    return res.status(503).json({ error: 'Online payment is not configured.' });
  }

  const t = targets[pickTarget(req.body)];
  const order = await t.get(String(req.body?.[t.idField] || '').trim());
  if (!order) return res.status(404).json({ error: `${t.label} not found.` });
  if (t.isPaid(order)) {
    return res.status(409).json({ error: `This ${t.label.toLowerCase()} is already paid.` });
  }

  const amountPaise = Math.round(t.amount(order) * 100);
  if (!amountPaise || amountPaise < 100) {
    return res.status(400).json({ error: 'Amount is too low for online payment.' });
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

  await t.setRef(order.id, rzpOrder.id);

  res.json({
    keyId: KEY_ID,
    razorpayOrderId: rzpOrder.id,
    amount: amountPaise,
    currency: 'INR',
    orderId: order.id,
    ...t.prefill(order)
  });
});

// Public: POST /api/payments/razorpay/verify
// Body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
router.post('/payments/razorpay/verify', async (req, res) => {
  const t = targets[pickTarget(req.body)];
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  const orderId = req.body?.[t.idField];
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment confirmation fields.' });
  }

  const order = await t.get(String(orderId).trim());
  if (!order) return res.status(404).json({ error: `${t.label} not found.` });

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

  const updated = await t.markPaid(order.id, `${razorpay_order_id}|${razorpay_payment_id}`);
  res.json({ verified: true, order: updated });
});

// Public: POST /api/payments/razorpay/webhook
// Safety net for buyers who pay but never return to the site (tab closed, network drop).
router.post('/payments/razorpay/webhook', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: 'Webhook not configured.' });
  const ok = verifyWebhookSignature({
    rawBody: req.rawBody,
    signature: req.get('X-Razorpay-Signature'),
    secret
  });
  if (!ok) return res.status(400).json({ error: 'Invalid signature.' });

  const { event, payload } = req.body || {};
  const payment = payload?.payment?.entity;
  if ((event === 'payment.captured' || event === 'order.paid') && payment?.order_id) {
    const ref = `${payment.order_id}|${payment.id}`;
    const order = await getDbOrderByPaymentRef(payment.order_id);
    if (order && order.paymentStatus !== 'Paid') await markDbOrderPaid(order.id, ref);
    const enr = await getDbEnrollmentByPaymentRef(payment.order_id);
    if (enr && enr.paymentStatus !== 'Paid') await targets.enrollment.markPaid(enr.id, ref);
  }
  res.json({ ok: true }); // always 200 for events we ignore, so Razorpay doesn't retry
});

export default router;
