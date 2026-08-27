import { getDbMessages, createDbMessage } from '../db/store.js';
import { asyncRouter } from '../lib/asyncRouter.js';

const router = asyncRouter();

// Public: POST /api/contact
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  const record = await createDbMessage(req.body);
  res.status(201).json(record);
});

// Admin: GET /api/admin/messages
router.get('/admin/messages', async (req, res) => {
  res.json(await getDbMessages());
});

export default router;
