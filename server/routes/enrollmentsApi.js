import { Router } from 'express';
import {
  getDbEnrollments,
  getDbEnrollmentById,
  createDbEnrollment,
  updateDbEnrollmentStatus
} from '../db/store.js';

const router = Router();

// Public: POST /api/enrollments (program/event enquiry & registration forms)
router.post('/enrollments', (req, res) => {
  const { fullName, name, phone } = req.body || {};
  if (!(fullName || name) || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }
  const enrollment = createDbEnrollment(req.body);
  res.status(201).json(enrollment);
});

// Admin: GET /api/admin/enrollments
router.get('/admin/enrollments', (req, res) => {
  res.json(getDbEnrollments());
});

// Admin: GET /api/admin/enrollments/:id
router.get('/admin/enrollments/:id', (req, res) => {
  const enrollment = getDbEnrollmentById(req.params.id);
  if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
  res.json(enrollment);
});

// Admin: PATCH /api/admin/enrollments/:id
router.patch('/admin/enrollments/:id', (req, res) => {
  const updated = updateDbEnrollmentStatus(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Enrollment not found' });
  res.json(updated);
});

export default router;
