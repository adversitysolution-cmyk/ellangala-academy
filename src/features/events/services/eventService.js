import { initialEvents } from '../data/eventSeedData.js';
import { adminAuthService } from '../../../admin/services/adminAuthService';

const API_BASE = '/api';
const STORAGE_KEY = 'ellangala_events';

function authHeaders() {
  const token = adminAuthService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getLocalEvents() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return initialEvents;
  }
}

function saveLocalEvents(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const eventService = {
  getEvents() {
    return getLocalEvents();
  },

  async getEventsAsync() {
    try {
      const res = await fetch(`${API_BASE}/events?all=true`);
      if (res.ok) {
        const data = await res.json();
        saveLocalEvents(data);
        return data;
      }
    } catch {
      // Fallback to local
    }
    return getLocalEvents();
  },

  getPublishedEvents() {
    const events = this.getEvents();
    return events.filter(e => e.status === 'published' || e.status === 'cancelled' || e.status === 'completed');
  },

  getUpcomingEvents() {
    const published = this.getPublishedEvents();
    const today = new Date().toISOString().split('T')[0];
    return published.filter(e => (e.date >= today || !e.date) && e.status !== 'completed');
  },

  getPastEvents() {
    const published = this.getPublishedEvents();
    const today = new Date().toISOString().split('T')[0];
    return published.filter(e => e.date < today || e.status === 'completed');
  },

  getEventById(id) {
    const events = this.getEvents();
    return events.find(e => String(e.id) === String(id)) || null;
  },

  getEventBySlug(slug) {
    const events = this.getEvents();
    return events.find(e => e.slug === slug || String(e.id) === String(slug)) || null;
  },

  createEvent(data) {
    const events = this.getEvents();
    const nextNum = events.length + 1;
    const year = new Date().getFullYear();
    const id = data.id || `EVT-${year}-${String(nextNum).padStart(4, '0')}`;

    let slug = (data.slug || data.title || 'event')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (events.some(e => e.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newRecord = {
      ...data,
      id,
      slug,
      status: data.status || 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newRecord, ...events];
    saveLocalEvents(updated);

    fetch(`${API_BASE}/admin/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(newRecord)
    }).catch(() => {});

    return newRecord;
  },

  updateEvent(id, data) {
    const events = this.getEvents();
    const index = events.findIndex(e => String(e.id) === String(id));
    if (index === -1) return null;

    const updated = {
      ...events[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    events[index] = updated;
    saveLocalEvents(events);

    fetch(`${API_BASE}/admin/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updated)
    }).catch(() => {});

    return updated;
  },

  deleteEvent(id) {
    const events = this.getEvents();
    const filtered = events.filter(e => String(e.id) !== String(id));
    saveLocalEvents(filtered);

    fetch(`${API_BASE}/admin/events/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).catch(() => {});

    return true;
  },

  publishEvent(id) {
    return this.updateEvent(id, { status: 'published' });
  },

  unpublishEvent(id) {
    return this.updateEvent(id, { status: 'draft' });
  },

  cancelEvent(id) {
    return this.updateEvent(id, { status: 'cancelled', registrationOpen: false });
  },

  duplicateEvent(id) {
    const original = this.getEventById(id);
    if (!original) return null;

    const duplicateData = {
      ...original,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy`,
      status: 'draft',
      featured: false
    };
    delete duplicateData.id;
    return this.createEvent(duplicateData);
  }
};
