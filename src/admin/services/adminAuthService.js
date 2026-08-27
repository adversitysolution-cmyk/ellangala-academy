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
  }
};
