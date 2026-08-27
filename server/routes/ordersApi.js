import {
  getDbOrders,
  getDbOrderById,
  createDbOrder,
  updateDbOrderStatus
} from '../db/store.js';
import { asyncRouter } from '../lib/asyncRouter.js';

const router = asyncRouter();

// Public: POST /api/orders (checkout submission)
router.post('/orders', async (req, res) => {
  const { firstName, phone, streetAddress } = req.body || {};
  if (!firstName || !phone || !streetAddress) {
    return res.status(400).json({ error: 'Name, phone and delivery address are required.' });
  }
  const order = await createDbOrder(req.body);
  res.status(201).json(order);
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
  const updated = await updateDbOrderStatus(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

export default router;
