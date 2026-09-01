import { adminFetch } from './apiClient';
import { adminAuthService } from './adminAuthService';

export const certificateService = {
  // --- settings ---
  getSettings(eventId) {
    return adminFetch(`/admin/events/${eventId}/certificate-settings`);
  },
  updateSettings(eventId, patch) {
    return adminFetch(`/admin/events/${eventId}/certificate-settings`, { method: 'PUT', body: JSON.stringify(patch) });
  },

  // --- templates ---
  getTemplates() {
    return adminFetch('/admin/certificate-templates');
  },
  createTemplate(data) {
    return adminFetch('/admin/certificate-templates', { method: 'POST', body: JSON.stringify(data) });
  },
  updateTemplate(id, data) {
    return adminFetch(`/admin/certificate-templates/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  // --- import ---
  async uploadSpreadsheet(eventId, file) {
    const token = adminAuthService.getToken();
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`/api/admin/events/${eventId}/certificate-imports`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Upload failed.');
    }
    return res.json();
  },
  setColumnMapping(batchId, columnMapping, phoneRequired) {
    return adminFetch(`/admin/certificate-imports/${batchId}/mapping`, {
      method: 'PUT', body: JSON.stringify({ columnMapping, phoneRequired })
    });
  },
  getBatch(batchId) {
    return adminFetch(`/admin/certificate-imports/${batchId}`);
  },
  updateParticipant(participantId, patch) {
    return adminFetch(`/admin/certificate-participants/${participantId}`, { method: 'PATCH', body: JSON.stringify(patch) });
  },
  generate(batchId) {
    return adminFetch(`/admin/certificate-imports/${batchId}/generate`, { method: 'POST' });
  },
  getBatchProgress(batchId) {
    return adminFetch(`/admin/certificate-batches/${batchId}/progress`);
  },
  retryBatch(batchId) {
    return adminFetch(`/admin/certificate-batches/${batchId}/retry`, { method: 'POST' });
  },

  // --- certificate management ---
  listCertificates(eventId, { search = '', filter = 'all' } = {}) {
    const qs = new URLSearchParams({ search, filter }).toString();
    return adminFetch(`/admin/events/${eventId}/certificates?${qs}`);
  },
  getCertificate(id) {
    return adminFetch(`/admin/certificates/${id}`);
  },
  downloadUrl(id) {
    return `/api/admin/certificates/${id}/download`;
  },
  resend(id) {
    return adminFetch(`/admin/certificates/${id}/resend`, { method: 'POST' });
  },
  revoke(id, reason) {
    return adminFetch(`/admin/certificates/${id}/revoke`, { method: 'POST', body: JSON.stringify({ reason }) });
  },
  retryFailedEmails(eventId) {
    return adminFetch(`/admin/events/${eventId}/certificate-emails/retry`, { method: 'POST' });
  }
};

// Public (no auth)
export const certificateVerifyService = {
  async byToken(token) {
    const res = await fetch(`/api/certificates/verify/${encodeURIComponent(token)}`);
    if (res.status === 404) return { status: 'NOT_FOUND' };
    if (!res.ok) throw new Error('Verification service unavailable.');
    return res.json();
  },
  async byNumber(number) {
    const res = await fetch(`/api/certificates/lookup/${encodeURIComponent(number)}`);
    if (res.status === 404) return { status: 'NOT_FOUND' };
    if (res.status === 429) throw new Error('Too many attempts. Please wait a minute and try again.');
    if (!res.ok) throw new Error('Verification service unavailable.');
    return res.json();
  }
};

// Admin-authorized download helper (adds bearer token, opens blob).
export async function downloadCertificatePdf(id, filename) {
  const token = adminAuthService.getToken();
  const res = await fetch(`/api/admin/certificates/${id}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Download failed.');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
