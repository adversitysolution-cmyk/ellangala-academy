import { adminFetch } from './apiClient';

export const adminUserService = {
  async getUsers({ status = 'all', search = '', sort = 'newest', fromDate = '', toDate = '' } = {}) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());
    if (sort) params.append('sort', sort);
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    const qs = params.toString();
    const res = await adminFetch(`/admin/users${qs ? `?${qs}` : ''}`);
    return res || { users: [], stats: { total: 0, active: 0, inactive: 0, newCount: 0 } };
  },

  async updateUserStatus(id, status) {
    return adminFetch(`/admin/users/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  async deleteUser(id) {
    return adminFetch(`/admin/users/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }
};
