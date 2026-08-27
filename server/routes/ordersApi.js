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
