import { adminFetch } from '../../../admin/services/apiClient';
import { initialEvents } from '../data/eventSeedData';

const API_BASE = '/api';

export const eventService = {
  async getEvents() {
    try {
      const res = await fetch(`${API_BASE}/events?all=true`);
      if (res.ok) return res.json();
    } catch (_) {}
    return initialEvents;
  },

  async getPublishedEvents() {
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (res.ok) return res.json();
    } catch (_) {}
    return initialEvents.filter(e => e.status === 'published' || e.status === 'cancelled' || e.status === 'completed');
  },

  async getUpcomingEvents() {
    const events = await this.getPublishedEvents();
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => (e.date >= today || !e.date) && e.status !== 'completed');
  },

  async getPastEvents() {
    const events = await this.getPublishedEvents();
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => (e.date < today && Boolean(e.date)) || e.status === 'completed');
  },

  async getEventBySlug(slug) {
    try {
      const res = await fetch(`${API_BASE}/events/${encodeURIComponent(slug)}`);
      if (res.ok) return res.json();
    } catch (_) {}
    return initialEvents.find(e => e.slug === slug || e.id === slug) || null;
  },

  async getEventById(id) {
    try {
      const res = await fetch(`${API_BASE}/events/${encodeURIComponent(id)}?admin=true`);
      if (res.ok) return res.json();
    } catch (_) {}
    return initialEvents.find(e => e.id === id || e.slug === id) || null;
  },

  async createEvent(data) {
    return adminFetch('/admin/events', { method: 'POST', body: JSON.stringify(data) });
  },

  async updateEvent(id, data) {
    return adminFetch(`/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  async deleteEvent(id) {
    await adminFetch(`/admin/events/${id}`, { method: 'DELETE' });
    return true;
  },

  async publishEvent(id) {
    return adminFetch(`/admin/events/${id}/publish`, { method: 'PATCH' });
  },

  async unpublishEvent(id) {
    return adminFetch(`/admin/events/${id}/unpublish`, { method: 'PATCH' });
  },

  async cancelEvent(id) {
    return this.updateEvent(id, { status: 'cancelled', registrationOpen: false });
  },

  async duplicateEvent(id) {
    const original = await this.getEventById(id);
    if (!original) return null;

    return this.createEvent({
      ...original,
      id: undefined,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy`,
      status: 'draft',
      featured: false
    });
  }
};
