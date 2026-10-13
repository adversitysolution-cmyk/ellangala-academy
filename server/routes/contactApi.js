import { getDbMessages, createDbMessage } from '../db/store.js';
import { asyncRouter } from '../lib/asyncRouter.js';
import { createNotification } from '../db/notificationStore.js';

const router = asyncRouter();

// Public: POST /api/contact
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  const record = await createDbMessage(req.body);

  createNotification({
    type: 'contact',
    title: 'New Contact Inquiry',
    message: `${name}: "${message.slice(0, 80)}${message.length > 80 ? '...' : ''}"`,
    authorName: name,
    authorEmail: email,
    targetUrl: '/admin/messages',
    metadata: { messageId: record.id }
  }).catch?.(() => {});

  res.status(201).json(record);
});

// Admin: GET /api/admin/messages
router.get('/admin/messages', async (req, res) => {
  res.json(await getDbMessages());
});

export default router;
