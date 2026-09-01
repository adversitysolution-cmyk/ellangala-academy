import { adminFetch } from './apiClient';

export const couponService = {
  async getCoupons() {
    return adminFetch('/admin/coupons');
  },

  async createCoupon(data) {
    return adminFetch('/admin/coupons', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateCoupon(id, data) {
    return adminFetch(`/admin/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteCoupon(id) {
    await adminFetch(`/admin/coupons/${id}`, { method: 'DELETE' });
    return true;
  }
};

// Public — used by the cart to check a code the customer typed.
export async function validateCoupon(code, subtotal) {
  const res = await fetch('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, subtotal })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Invalid coupon code.');
  return data;
}
