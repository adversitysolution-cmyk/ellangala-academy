import { adminFetch } from './apiClient';

export const adminNotificationService = {
  async getNotifications({ type = 'all', unreadOnly = false, page = 1, limit = 50 } = {}) {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (unreadOnly) params.append('unreadOnly', 'true');
    params.append('page', String(page));
    params.append('limit', String(limit));

    const res = await adminFetch(`/api/admin/notifications?${params.toString()}`);
    if (!res.ok) {
      return { notifications: [], total: 0, unreadCount: 0 };
    }
    return res.json();
  },

  async getUnreadCount() {
    try {
      const res = await adminFetch('/api/admin/notifications/unread-count');
      if (!res.ok) return 0;
      const data = await res.json();
      return data.unreadCount || 0;
    } catch {
      return 0;
    }
  },

  async markAsRead(id) {
    const res = await adminFetch(`/api/admin/notifications/${id}/read`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to mark notification as read.');
    return res.json();
  },

  async markAllAsRead() {
    const res = await adminFetch('/api/admin/notifications/mark-all-read', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to mark all as read.');
    return res.json();
  },

  async deleteNotification(id) {
    const res = await adminFetch(`/api/admin/notifications/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete notification.');
    return res.json();
  },

  async clearRead() {
    const res = await adminFetch('/api/admin/notifications/clear-all', {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to clear read notifications.');
    return res.json();
  }
};
