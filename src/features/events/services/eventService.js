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
  },

  async getNextUpcomingEvent(now = new Date()) {
    const events = await this.getPublishedEvents();
    return getNextEligibleUpcomingEvent(events, now);
  }
};

// Closed once the start date is before today (local date), or marked completed/cancelled.
export function isEventClosed(e) {
  if (!e) return false;
  if (e.status === 'completed' || e.status === 'cancelled') return true;
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return Boolean(e.date) && e.date < today;
}

export function normalizeTimeString(str, defaultTime = '00:00') {
  if (!str || typeof str !== 'string') return defaultTime;
  const trimmed = str.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3] ? match[3].toUpperCase() : null;
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }
  return defaultTime;
}

export function getEventStartDateTime(event) {
  if (!event || !event.date) return null;
  const time = normalizeTimeString(event.startTime, '00:00');
  const [y, m, d] = event.date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function getEventEndDateTime(event) {
  if (!event || !event.date) return null;
  const lastDate = event.endDate && event.endDate >= event.date ? event.endDate : event.date;
  let defaultEnd = '23:59';
  if (event.startTime) {
    const st = normalizeTimeString(event.startTime, '00:00');
    const [h, m] = st.split(':').map(Number);
    defaultEnd = `${String(Math.min(h + 2, 23)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  const time = normalizeTimeString(event.endTime, defaultEnd);
  const [y, m, d] = lastDate.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 59, 999);
}

export function isEligibleUpcomingEvent(event, now = new Date()) {
  if (!event || !event.date) return false;
  if (event.status && !['published', 'upcoming'].includes(event.status)) return false;
  if (event.status === 'completed' || event.status === 'cancelled' || event.status === 'draft') return false;

  if (isEventClosed(event)) return false;

  const end = getEventEndDateTime(event);
  if (!end || isNaN(end.getTime())) return false;
  return end.getTime() > now.getTime();
}

export function getNextEligibleUpcomingEvent(events, now = new Date()) {
  if (!Array.isArray(events) || events.length === 0) return null;
  const eligible = events.filter((e) => isEligibleUpcomingEvent(e, now));
  if (eligible.length === 0) return null;

  eligible.sort((a, b) => {
    const startA = getEventStartDateTime(a)?.getTime() || 0;
    const startB = getEventStartDateTime(b)?.getTime() || 0;
    return startA - startB;
  });

  return eligible[0] || null;
}

export function formatTime12Hour(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const trimmed = timeStr.trim();
  if (/AM|PM/i.test(trimmed)) return trimmed;
  const match = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return trimmed;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  if (isNaN(hours)) return trimmed;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function formatEventTimeRange(startTime, endTime, timeDisplay) {
  if (timeDisplay && typeof timeDisplay === 'string' && timeDisplay.trim()) {
    if (/AM|PM/i.test(timeDisplay)) {
      return timeDisplay.trim();
    }
    return timeDisplay.replace(/\b(\d{1,2}):(\d{2})\b/g, (match, h, m) => {
      let hours = parseInt(h, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
      return `${hours}:${m} ${ampm}`;
    });
  }
  const start = formatTime12Hour(startTime);
  const end = formatTime12Hour(endTime);
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;
  return '';
}


