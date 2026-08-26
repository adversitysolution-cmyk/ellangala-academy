import { Router } from 'express';
import {
  getDbEvents,
  getDbEventBySlug,
  getDbEventById,
  saveDbEvent,
  deleteDbEvent
} from '../db/store.js';
import { generateContentSeo } from '../lib/seoGenerator.js';

const router = Router();

// Public: GET /api/events (Returns published events by default)
router.get('/events', (req, res) => {
  const { status, all } = req.query;
  if (all === 'true' || status === 'all') {
    return res.json(getDbEvents());
  }
  const statusFilter = status || 'published';
  const events = getDbEvents().filter(e => {
    if (statusFilter === 'published') {
      return e.status === 'published' || e.status === 'cancelled' || e.status === 'completed';
    }
    return e.status === statusFilter;
  });
  res.json(events);
});

// Public: GET /api/events/:slug
router.get('/events/:slug', (req, res) => {
  const { slug } = req.params;
  const event = getDbEventBySlug(slug);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Draft events cannot be viewed publicly unless requested by admin
  if (event.status === 'draft' && req.query.admin !== 'true') {
    return res.status(404).json({ error: 'Event not found' });
  }

  const generatedSeo = generateContentSeo({
    type: 'event',
    title: event.title,
    slug: event.slug,
    description: event.shortDescription || event.description,
    image: event.image,
    customSeo: event.seo
  });

  res.json({
    ...event,
    seo: generatedSeo
  });
});

// Admin: POST /api/admin/events
router.post('/admin/events', (req, res) => {
  try {
    const newRecord = saveDbEvent(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: PUT /api/admin/events/:id
router.put('/admin/events/:id', (req, res) => {
  try {
    const updated = saveDbEvent({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: DELETE /api/admin/events/:id
router.delete('/admin/events/:id', (req, res) => {
  const success = deleteDbEvent(req.params.id);
  if (success) {
    res.json({ success: true, message: 'Event deleted successfully' });
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

// Admin: PATCH /api/admin/events/:id/publish
router.patch('/admin/events/:id/publish', (req, res) => {
  const existing = getDbEventById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Event not found' });

  const updated = saveDbEvent({ ...existing, status: 'published' });
  res.json(updated);
});

// Admin: PATCH /api/admin/events/:id/unpublish
router.patch('/admin/events/:id/unpublish', (req, res) => {
  const existing = getDbEventById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Event not found' });

  const updated = saveDbEvent({ ...existing, status: 'draft' });
  res.json(updated);
});

export default router;
