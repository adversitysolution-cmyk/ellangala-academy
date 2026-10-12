import { adminFetch } from './apiClient';
import { adminAuthService } from './adminAuthService';
import { programsData } from '../../contents/programsData.content';

const API_BASE = '/api';

export const communityAdminService = {
  async getCategories() {
    const res = await fetch(`${API_BASE}/community/categories`);
    if (!res.ok) return [];
    return res.json();
  },

  async getPosts({ category, filter, page = 1, limit = 50, search, status = 'all' } = {}) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (filter && filter !== 'all') params.append('filter', filter);
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    params.append('page', String(page));
    params.append('limit', String(limit));

    return adminFetch(`/admin/community/posts?${params.toString()}`);
  },

  async getPostById(id) {
    return adminFetch(`/admin/community/posts/${encodeURIComponent(id)}`);
  },

  async createPost(data) {
    return adminFetch('/admin/community/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updatePost(id, data) {
    return adminFetch(`/admin/community/posts/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deletePost(id) {
    return adminFetch(`/admin/community/posts/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  async togglePin(id, isPinned) {
    return adminFetch(`/admin/community/posts/${encodeURIComponent(id)}/pin`, {
      method: 'PATCH',
      body: JSON.stringify({ isPinned })
    });
  },

  async uploadMediaFiles(files) {
    const formData = new FormData();
    for (const f of files) {
      formData.append('media', f);
    }

    const token = adminAuthService.getToken();
    const res = await fetch(`${API_BASE}/admin/community/upload-media`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload media files.');
    }

    return res.json();
  },

  async getComments({ status = 'all', page = 1, limit = 50 } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    params.append('page', String(page));
    params.append('limit', String(limit));

    return adminFetch(`/admin/community/comments?${params.toString()}`);
  },

  async updateCommentStatus(id, status) {
    return adminFetch(`/admin/community/comments/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async deleteComment(id) {
    return adminFetch(`/admin/community/comments/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  async getAvailableLinkOptions() {
    // 1. Static course programs from programsData
    const courses = Object.keys(programsData).map(slug => ({
      slug,
      title: programsData[slug].title,
      type: programsData[slug].type || 'Course'
    }));

    // 2. Active events from /api/events
    let events = [];
    try {
      const res = await fetch(`${API_BASE}/events?all=true`);
      if (res.ok) {
        const list = await res.json();
        events = (list || []).map(e => ({
          id: e.id,
          title: e.title,
          date: e.date,
          slug: e.slug || e.id
        }));
      }
    } catch (_) {}

    return { courses, events };
  }
};
