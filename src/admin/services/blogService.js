import { adminFetch } from './apiClient';

const API_BASE = '/api';

export const blogService = {
  async getBlogs() {
    const res = await fetch(`${API_BASE}/blogs?all=true`);
    if (!res.ok) throw new Error('Could not load blog posts.');
    return res.json();
  },

  async getBlogsAsync() {
    return this.getBlogs();
  },

  async getPublishedBlogs() {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error('Could not load blog posts.');
    return res.json();
  },

  async getBlogBySlug(slug, { admin = false } = {}) {
    const query = admin ? '?admin=true' : '';
    const res = await fetch(`${API_BASE}/blogs/${encodeURIComponent(slug)}${query}`);
    if (!res.ok) return null;
    return res.json();
  },

  async getBlogById(id) {
    return this.getBlogBySlug(id, { admin: true });
  },

  async createBlog(data) {
    return adminFetch('/admin/blogs', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateBlog(id, data) {
    return adminFetch(`/admin/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteBlog(id) {
    await adminFetch(`/admin/blogs/${id}`, { method: 'DELETE' });
    return true;
  },

  async publishBlog(id) {
    return adminFetch(`/admin/blogs/${id}/publish`, { method: 'PATCH' });
  },

  async unpublishBlog(id) {
    return adminFetch(`/admin/blogs/${id}/unpublish`, { method: 'PATCH' });
  },

  async archiveBlog(id) {
    return this.updateBlog(id, { status: 'archived' });
  }
};
