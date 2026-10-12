const API_BASE = '/api';

export const communityService = {
  getVisitorId() {
    try {
      const raw = localStorage.getItem('ellangala_community_session');
      if (raw) {
        const session = JSON.parse(raw);
        if (session?.user?.id) {
          return session.user.id;
        }
      }
    } catch (_) {}

    let id = localStorage.getItem('ellangala_community_visitor_id');
    if (!id) {
      id = 'vis_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem('ellangala_community_visitor_id', id);
    }
    return id;
  },

  getVisitorProfile() {
    try {
      const rawSession = localStorage.getItem('ellangala_community_session');
      if (rawSession) {
        const session = JSON.parse(rawSession);
        if (session?.user) {
          return {
            name: session.user.name,
            email: session.user.email || '',
            avatar: session.user.avatarUrl || '/assets/images/resources/founder-avatar.png'
          };
        }
      }
    } catch (_) {}

    const raw = localStorage.getItem('ellangala_community_visitor_profile');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (_) {}
    }
    return {
      name: 'Academy Learner',
      email: '',
      avatar: '/assets/images/resources/founder-avatar.png'
    };
  },

  setVisitorProfile(profile) {
    localStorage.setItem('ellangala_community_visitor_profile', JSON.stringify(profile));
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/community/categories`);
    if (!res.ok) throw new Error('Could not load community channels.');
    return res.json();
  },

  async getPosts({ category, filter = 'latest', page = 1, limit = 10, search = '' } = {}) {
    const visitorId = this.getVisitorId();
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (filter && filter !== 'all') params.append('filter', filter);
    if (search) params.append('search', search);
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('visitorId', visitorId);

    const res = await fetch(`${API_BASE}/community/posts?${params.toString()}`);
    if (!res.ok) throw new Error('Could not load community posts.');
    return res.json();
  },

  async getPostById(id) {
    const visitorId = this.getVisitorId();
    const res = await fetch(`${API_BASE}/community/posts/${encodeURIComponent(id)}?visitorId=${encodeURIComponent(visitorId)}`);
    if (!res.ok) throw new Error('Could not load post details.');
    return res.json();
  },

  async toggleLike(postId) {
    const visitorId = this.getVisitorId();
    const res = await fetch(`${API_BASE}/community/posts/${encodeURIComponent(postId)}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId })
    });
    if (!res.ok) throw new Error('Could not update like.');
    return res.json();
  },

  async toggleSave(postId) {
    const visitorId = this.getVisitorId();
    const res = await fetch(`${API_BASE}/community/posts/${encodeURIComponent(postId)}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId })
    });
    if (!res.ok) throw new Error('Could not save post.');
    return res.json();
  },

  async getComments(postId, { page = 1, limit = 20 } = {}) {
    const res = await fetch(`${API_BASE}/community/posts/${encodeURIComponent(postId)}/comments?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Could not load comments.');
    return res.json();
  },

  async postComment(postId, { authorName, authorEmail, content }) {
    const visitorId = this.getVisitorId();
    const res = await fetch(`${API_BASE}/community/posts/${encodeURIComponent(postId)}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorName,
        authorEmail,
        content,
        visitorId
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit comment.');
    }
    // Update local profile name
    if (authorName) {
      this.setVisitorProfile({ name: authorName, email: authorEmail || '' });
    }
    return res.json();
  },

  async getSidebarData(channelId) {
    const query = channelId && channelId !== 'all' ? `?channel=${encodeURIComponent(channelId)}` : '';
    const res = await fetch(`${API_BASE}/community/sidebar-data${query}`);
    if (!res.ok) return { featuredCourse: null, upcomingEvents: [], recommendedCourses: [] };
    return res.json();
  },

  // Community User Auth APIs (30-day session support)
  async signUp({ name, phone, email, password, avatarUrl, topics }) {
    const res = await fetch(`${API_BASE}/community/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password, avatarUrl, topics })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to complete registration.');
    }
    return data;
  },

  async login({ identifier, password }) {
    const res = await fetch(`${API_BASE}/community/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials.');
    }
    return data;
  },

  async getMe(token) {
    if (!token) return null;
    const res = await fetch(`${API_BASE}/community/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  },

  async logout(token) {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/community/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (_) {}
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch(`${API_BASE}/community/auth/upload-avatar`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Avatar upload failed.');
    }
    return data.avatarUrl;
  },

  async getUserLearning(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/community/user/learning`, { headers });
    if (!res.ok) return { enrolledCourses: [], stats: { totalCourses: 0, completedLessons: 0, hoursInvested: 0 } };
    return res.json();
  },

  async getUserWorkshops(token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/community/user/workshops`, { headers });
    if (!res.ok) return { enrolledEvents: [] };
    return res.json();
  }
};

