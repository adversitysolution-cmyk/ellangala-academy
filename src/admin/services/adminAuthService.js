// Admin Authentication Service for Ellangala's Academy Admin Portal
// Talks to POST /api/admin/login; the server verifies credentials and issues
// a bearer token that adminFetch (apiClient.js) attaches to admin API calls.

const SESSION_KEY = 'ellangala_admin_session';

export const adminAuthService = {
  async login(email, password, remember = true) {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { success: false, message: body.error || 'Invalid email or password.' };
      }

      const sessionData = {
        token: body.token,
        user: body.user,
        loginTime: new Date().toISOString()
      };

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      (remember ? sessionStorage : localStorage).removeItem(SESSION_KEY);

      return { success: true, session: sessionData };
    } catch {
      return { success: false, message: 'Could not reach the server. Please try again.' };
    }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  },

  getSession() {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  getToken() {
    return this.getSession()?.token || null;
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  getCurrentUser() {
    return this.getSession()?.user || null;
  },

  updateCurrentUser(partialUser) {
    const session = this.getSession();
    if (!session) return null;
    session.user = { ...(session.user || {}), ...partialUser };
    const storage = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    return session.user;
  },

  async getProfile() {
    const token = this.getToken();
    const res = await fetch('/api/admin/profile', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch admin profile.');
    }
    const data = await res.json();
    if (data.profile) {
      this.updateCurrentUser(data.profile);
    }
    return data.profile;
  },

  async updateProfile(profileData) {
    const token = this.getToken();
    const res = await fetch('/api/admin/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update admin profile.');
    }
    const data = await res.json();
    if (data.profile) {
      this.updateCurrentUser(data.profile);
    }
    return data.profile;
  },

  async uploadAvatar(file) {
    // Client-side 2MB maximum limit verification
    const MAX_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      throw new Error(`Profile photo exceeds 2MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a file up to 2MB.`);
    }

    const token = this.getToken();
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/admin/profile/avatar', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    if (res.status === 401) {
      throw new Error('Admin session expired or token missing. Please sign in again.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Upload failed with status ${res.status}.`);
    }

    const data = await res.json();
    if (data.profile) {
      this.updateCurrentUser(data.profile);
    }
    return data;
  },

  async deleteAvatar() {
    const token = this.getToken();
    const res = await fetch('/api/admin/profile/avatar', {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (res.status === 401) {
      throw new Error('Admin session expired or token missing. Please sign in again.');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to remove photo (${res.status}).`);
    }

    const data = await res.json();
    if (data.profile) {
      this.updateCurrentUser(data.profile);
    }
    return data;
  }
};
