import {
  getDbEnrollments,
  getDbEnrollmentById,
  createDbEnrollment,
  updateDbEnrollmentStatus
} from '../db/store.js';
import { asyncRouter } from '../lib/asyncRouter.js';

const router = asyncRouter();

// Public: POST /api/enrollments (program/event enquiry & registration forms)
router.post('/enrollments', async (req, res) => {
  const { fullName, name, phone } = req.body || {};
  if (!(fullName || name) || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }
  const enrollment = await createDbEnrollment(req.body);
  res.status(201).json(enrollment);
});

// Admin: GET /api/admin/enrollments
router.get('/admin/enrollments', async (req, res) => {
  res.json(await getDbEnrollments());
});

// Admin: GET /api/admin/enrollments/:id
router.get('/admin/enrollments/:id', async (req, res) => {
  const enrollment = await getDbEnrollmentById(req.params.id);
  if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
  res.json(enrollment);
});

// Admin: PATCH /api/admin/enrollments/:id
router.patch('/admin/enrollments/:id', async (req, res) => {
  const updated = await updateDbEnrollmentStatus(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Enrollment not found' });
  res.json(updated);
});

export default router;
