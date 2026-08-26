import { Router } from 'express';
import {
  getDbOrders,
  getDbOrderById,
  createDbOrder,
  updateDbOrderStatus
} from '../db/store.js';

const router = Router();

// Public: POST /api/orders (checkout submission)
router.post('/orders', (req, res) => {
  const { firstName, phone, streetAddress } = req.body || {};
  if (!firstName || !phone || !streetAddress) {
    return res.status(400).json({ error: 'Name, phone and delivery address are required.' });
  }
  const order = createDbOrder(req.body);
  res.status(201).json(order);
});

// Admin: GET /api/admin/orders
router.get('/admin/orders', (req, res) => {
  res.json(getDbOrders());
});

// Admin: GET /api/admin/orders/:id
router.get('/admin/orders/:id', (req, res) => {
  const order = getDbOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Admin: PATCH /api/admin/orders/:id
router.patch('/admin/orders/:id', (req, res) => {
  const updated = updateDbOrderStatus(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

export default router;
