import { asyncRouter } from '../lib/asyncRouter.js';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearReadNotifications
} from '../db/notificationStore.js';

const router = asyncRouter();

// GET /api/admin/notifications - Get paginated & filtered notifications + unread count
router.get('/admin/notifications', async (req, res) => {
  const { type, unreadOnly, page, limit } = req.query;
  const result = await getNotifications({
    type: type || 'all',
    unreadOnly: unreadOnly === 'true' || unreadOnly === true,
    page,
    limit
  });
  res.json(result);
});

// GET /api/admin/notifications/unread-count - Quick unread summary for header badge
router.get('/admin/notifications/unread-count', async (req, res) => {
  const unreadCount = await getUnreadNotificationCount();
  res.json({ unreadCount });
});

// PATCH /api/admin/notifications/:id/read - Mark single notification as read
router.patch('/admin/notifications/:id/read', async (req, res) => {
  const item = await markNotificationAsRead(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Notification not found.' });
  }
  res.json({ success: true, notification: item });
});

// POST /api/admin/notifications/mark-all-read - Mark all as read
router.post('/admin/notifications/mark-all-read', async (req, res) => {
  const result = await markAllNotificationsAsRead();
  res.json(result);
});

// DELETE /api/admin/notifications/:id - Delete single notification
router.delete('/admin/notifications/:id', async (req, res) => {
  const result = await deleteNotification(req.params.id);
  res.json(result);
});

// DELETE /api/admin/notifications/clear-all - Clear all read notifications
router.delete('/admin/notifications/clear-all', async (req, res) => {
  const result = await clearReadNotifications();
  res.json(result);
});

export default router;
