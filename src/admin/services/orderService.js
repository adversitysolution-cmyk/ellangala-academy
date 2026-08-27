import { adminFetch } from './apiClient';

export const orderService = {
  async getOrders() {
    return adminFetch('/admin/orders');
  },

  async getOrderById(id) {
    return adminFetch(`/admin/orders/${id}`);
  },

  async addOrder(checkoutData) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Could not place order.');
    }
    return res.json();
  },

  async updateOrderStatus(id, status, internalNotes) {
    return adminFetch(`/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, internalNotes })
    });
  }
};
