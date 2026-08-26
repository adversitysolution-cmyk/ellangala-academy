import { Router } from 'express';
import { getDbMessages, createDbMessage } from '../db/store.js';

const router = Router();

// Public: POST /api/contact
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  const record = createDbMessage(req.body);
  res.status(201).json(record);
});

// Admin: GET /api/admin/messages
router.get('/admin/messages', (req, res) => {
  res.json(getDbMessages());
});

export default router;
