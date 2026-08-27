import { adminFetch } from './apiClient';

export const enrollmentService = {
  async getEnrollments() {
    return adminFetch('/admin/enrollments');
  },

  async getEnrollmentById(id) {
    return adminFetch(`/admin/enrollments/${id}`);
  },

  async addEnrollment(formData) {
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Could not submit enquiry.');
    }
    return res.json();
  },

  async updateEnrollmentStatus(id, status, internalNotes) {
    return adminFetch(`/admin/enrollments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, internalNotes })
    });
  }
};
