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
    const list = Array.isArray(files) ? files : [files];
    const formData = new FormData();
    for (const f of list) {
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

    const data = await res.json();
    return data.media || [];
  },

  async uploadMedia(file) {
    const mediaList = await this.uploadMediaFiles([file]);
    if (!mediaList || mediaList.length === 0) {
      throw new Error('Upload failed.');
    }
    return mediaList[0];
  },

  async getComments({ postId, status = 'all', page = 1, limit = 50 } = {}) {
    const params = new URLSearchParams();
    if (postId) params.append('postId', postId);
    if (status && status !== 'all') params.append('status', status);
    params.append('page', String(page));
    params.append('limit', String(limit));

    return adminFetch(`/admin/community/comments?${params.toString()}`);
  },

  async postComment(postId, { authorName = 'Dr. Naveen Ellangala', authorEmail = 'admin@ellangala.com', content }) {
    const res = await fetch(`${API_BASE}/community/posts/${encodeURIComponent(postId)}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorName,
        authorEmail,
        content
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit admin reply.');
    }
    return res.json();
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
  },

  async getQuoteCard() {
    try {
      const res = await fetch(`${API_BASE}/community/quote-card`);
      if (res.ok) {
        const data = await res.json();
        return data.quoteCard;
      }
    } catch (_) {}
    return {
      quote: "A calmer mind creates a brighter life.",
      author: "DR. NAVEEN ELLANGALA",
      imageUrl: "/assets/images/community/mountain-quote-bg.jpg"
    };
  },

  async updateQuoteCard({ quote, author, imageUrl }) {
    return adminFetch('/admin/community/quote-card', {
      method: 'PATCH',
      body: JSON.stringify({ quote, author, imageUrl })
    });
  },

  async uploadQuoteCardImage(file) {
    const token = adminAuthService.getToken();
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload image.');
    }
    const data = await res.json();
    return data.url;
  },

  async getHeroBanner() {
    try {
      const res = await fetch(`${API_BASE}/community/hero-banner`);
      if (res.ok) {
        const data = await res.json();
        return data.heroBanner;
      }
    } catch (_) {}
    return {
      heading: "Welcome to the\nEllangala Feed",
      subheading: "Learn, reflect, and grow with Dr. Naveen Ellangala.",
      imageUrl: "/assets/images/community/founder-feed-hero.png",
      gradientColor: "#FFFDF8",
      textColorMode: "auto",
      badge1: { text: "Meaningful Discussions", icon: "users" },
      badge2: { text: "Practical Wisdom", icon: "book" },
      badge3: { text: "Supportive Community", icon: "sparkles" }
    };
  },

  async updateHeroBanner(payload) {
    return adminFetch('/admin/community/hero-banner', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async uploadHeroBannerImage(file) {
    const token = adminAuthService.getToken();
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload hero image.');
    }
    const data = await res.json();
    return data.url;
  }
};
