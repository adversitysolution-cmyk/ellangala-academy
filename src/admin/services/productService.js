import { adminFetch } from './apiClient';

const API_BASE = '/api';

export const productService = {
  async getProducts() {
    const res = await fetch(`${API_BASE}/products?all=true`);
    if (!res.ok) throw new Error('Could not load products.');
    return res.json();
  },

  async getPublishedProducts() {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Could not load products.');
    return res.json();
  },

  async getProductById(id, { admin = true } = {}) {
    const qs = admin ? '?admin=true' : '';
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}${qs}`);
    if (!res.ok) return null;
    return res.json();
  },

  async createProduct(data) {
    return adminFetch('/admin/products', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateProduct(id, data) {
    return adminFetch(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteProduct(id) {
    await adminFetch(`/admin/products/${id}`, { method: 'DELETE' });
    return true;
  }
};
