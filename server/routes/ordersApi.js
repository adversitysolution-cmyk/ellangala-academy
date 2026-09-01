import {
  getDbOrders,
  getDbOrderById,
  createDbOrder,
  updateDbOrderStatus,
  validateDbCoupon,
  incrementCouponUsage
} from '../db/store.js';
import { asyncRouter } from '../lib/asyncRouter.js';
import { sendMail } from '../lib/mailer.js';
import { siteConfig } from '../../src/seo/siteConfig.js';

const STATUS_MESSAGES = {
  New: 'has been received and is being reviewed',
  Processing: 'is now being processed',
  Shipped: 'has been shipped',
  Delivered: 'has been delivered',
  Cancelled: 'has been cancelled'
};

function sendOrderStatusEmail(order) {
  const trackUrl = `${siteConfig.url}/track-order?orderId=${encodeURIComponent(order.id)}`;
  const statusPhrase = STATUS_MESSAGES[order.status] || `is now marked as "${order.status}"`;
  return sendMail({
    to: order.email,
    subject: `Your order ${order.id} ${statusPhrase}`,
    text: `Hi ${order.customerName || ''},\n\nYour order ${order.id} ${statusPhrase}.\n\nTrack your order: ${trackUrl}\n\n— Ellangala’s Academy`,
    html: `<p>Hi ${order.customerName || ''},</p><p>Your order <strong>${order.id}</strong> ${statusPhrase}.</p><p><a href="${trackUrl}">Track your order</a></p><p>— Ellangala’s Academy</p>`
  });
}

const router = asyncRouter();

// Public: POST /api/orders (checkout submission)
router.post('/orders', async (req, res) => {
  const { firstName, phone, streetAddress } = req.body || {};
  if (!firstName || !phone || !streetAddress) {
    return res.status(400).json({ error: 'Name, phone and delivery address are required.' });
  }
  // Re-check any coupon server-side — never trust the browser's discount amount.
  // ponytail: subtotal still comes from the client; recompute it from DB product
  // prices if order-total tampering becomes a real concern.
  const payload = { ...req.body };
  if (payload.couponCode) {
    const subtotal = Number(payload.subtotal) || 0;
    const check = await validateDbCoupon(payload.couponCode, subtotal);
    if (!check.ok) {
      return res.status(400).json({ error: check.error, couponRejected: true });
    }
    payload.discountAmount = check.discount;
    payload.total = Math.max(0, subtotal - check.discount + (Number(payload.shipping) || 0));
    payload.couponCode = check.coupon.code;
  } else {
    payload.couponCode = null;
    payload.discountAmount = 0;
  }

  const order = await createDbOrder(payload);
  res.status(201).json(order);

  // ponytail: counts usage at order-placement, so an abandoned online payment
  // still consumes one. Move to the payment-verify step if that matters.
  if (order.couponCode) {
    incrementCouponUsage(order.couponCode).catch(err =>
      console.error('Failed to increment coupon usage:', err.message)
    );
  }
});

// Public: POST /api/orders/track (order ID + email/phone lookup)
router.post('/orders/track', async (req, res) => {
  const { orderId, contact } = req.body || {};
  if (!orderId || !contact) {
    return res.status(400).json({ error: 'Order ID and the email or phone used at checkout are required.' });
  }

  const order = await getDbOrderById(orderId.trim());
  const normalizedContact = contact.trim().toLowerCase();
  const digitsOnly = contact.trim().replace(/\D/g, '');
  const matches = order && (
    (order.email || '').toLowerCase() === normalizedContact ||
    (digitsOnly && (order.phone || '').replace(/\D/g, '') === digitsOnly)
  );

  if (!matches) {
    return res.status(404).json({ error: 'No order found matching that Order ID and contact info.' });
  }

  res.json({
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    totalAmount: order.totalAmount,
    city: order.city,
    state: order.state,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  });
});

// Admin: GET /api/admin/orders
router.get('/admin/orders', async (req, res) => {
  res.json(await getDbOrders());
});

// Admin: GET /api/admin/orders/:id
router.get('/admin/orders/:id', async (req, res) => {
  const order = await getDbOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Admin: PATCH /api/admin/orders/:id
router.patch('/admin/orders/:id', async (req, res) => {
  const existing = await getDbOrderById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Order not found' });

  const updated = await updateDbOrderStatus(req.params.id, req.body);
  res.json(updated);

  if (req.body?.status && req.body.status !== existing.status && updated.email) {
    sendOrderStatusEmail(updated);
  }
});

export default router;
