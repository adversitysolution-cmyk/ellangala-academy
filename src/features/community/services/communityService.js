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
    } catch (_) { }

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
    } catch (_) { }

    const raw = localStorage.getItem('ellangala_community_visitor_profile');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (_) { }
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

  async getQuoteCard() {
    try {
      const res = await fetch(`${API_BASE}/community/quote-card`);
      if (res.ok) {
        const data = await res.json();
        return data.quoteCard;
      }
    } catch (_) { }
    return {
      quote: "A calmer mind creates a brighter life.",
      author: "DR. NAVEEN ELLANGALA",
      imageUrl: "/assets/images/community/mountain-quote-bg.jpg"
    };
  },

  async getHeroBanner() {
    try {
      const res = await fetch(`${API_BASE}/community/hero-banner`);
      if (res.ok) {
        const data = await res.json();
        return data.heroBanner;
      }
    } catch (_) { }
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
    } catch (_) { }
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

  async updateProfile(token, profileData) {
    if (!token) throw new Error('Authentication required.');
    const res = await fetch(`${API_BASE}/community/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update profile.');
    }
    return data.user;
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

/**
 * Builds an SEO & human-friendly public share slug with author name and post title letters + id
 * Example: dr-naveen-ellangala-welcome-to-the-ellangala-community-post-seed-001
 */
export function buildPostShareSlug(post) {
  if (!post) return '';

  const cleanAuthor = (post.authorName || '')
    .replace(/^dr\.?\s*/i, 'dr-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20)
    .replace(/-+$/, '');

  const cleanTitle = (post.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '');

  const id = post.id || '';

  const parts = [];
  if (cleanAuthor) parts.push(cleanAuthor);
  if (cleanTitle) parts.push(cleanTitle);
  if (id) parts.push(id);

  return parts.join('-') || id;
}

/**
 * Extracts raw unique post ID (e.g. post-seed-001 or POST-2026-XXXX) from a human-readable slug
 */
export function extractPostIdFromSlug(slugOrId) {
  if (!slugOrId) return '';
  const str = String(slugOrId).trim();

  // 1. Direct seed pattern
  const seedMatch = str.match(/post-seed-\d+/i);
  if (seedMatch) return seedMatch[0].toLowerCase();

  // 2. Direct POST GUID pattern
  const guidMatch = str.match(/POST-\d{4}-[A-Z0-9]+/i);
  if (guidMatch) return guidMatch[0];

  // 3. Fallback: check last hyphen segment
  const parts = str.split('-');
  if (parts.length > 1) {
    const last = parts[parts.length - 1];
    if (last.length >= 6) return last;
  }

  return str;
}


