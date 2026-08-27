import { adminAuthService } from './adminAuthService';

export const uploadService = {
  async uploadImage(file) {
    const token = adminAuthService.getToken();
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Image upload failed.');
    }
    return res.json();
  }
};
