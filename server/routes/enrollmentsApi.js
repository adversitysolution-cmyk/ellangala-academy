import {
  getDbEnrollments,
  getDbEnrollmentById,
  createDbEnrollment,
  updateDbEnrollmentStatus,
  getDbEventById
} from '../db/store.js';
import { asyncRouter } from '../lib/asyncRouter.js';
import { sendMail } from '../lib/mailer.js';
import { buildRegistrationEmail } from '../lib/eventRegistrationEmail.js';

async function sendEventRegistrationEmail(enrollment) {
  if (!enrollment.email || enrollment.sourceType !== 'Event' || !enrollment.eventId) return;
  const event = await getDbEventById(enrollment.eventId);
  if (!event) return;
  await sendMail(buildRegistrationEmail(enrollment, event));
}

export { sendEventRegistrationEmail };

const router = asyncRouter();

// Public: POST /api/enrollments (program/event enquiry & registration forms)
router.post('/enrollments', async (req, res) => {
  const { fullName, name, phone } = req.body || {};
  if (!(fullName || name) || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }
  const body = { ...req.body };
  // Never trust client-sent payment fields; derive them from the event.
  delete body.amount;
  delete body.paymentStatus;
  let needsPayment = false;
  if (body.sourceType === 'Event' && body.eventId) {
    const event = await getDbEventById(body.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found.' });
    const seats = Math.min(Math.max(parseInt(body.attendeesCount, 10) || 1, 1), 5);
    const amount = event.priceType === 'Paid' ? Math.round(Number(event.price) || 0) * seats : 0;
    if (amount > 0) {
      needsPayment = true;
      Object.assign(body, { amount, paymentStatus: 'Pending', status: 'Pending Payment' });
    }
  }
  const enrollment = await createDbEnrollment(body);
  res.status(201).json(enrollment);
  // Paid events get their confirmation email once payment is verified.
  if (!needsPayment) {
    sendEventRegistrationEmail(enrollment).catch(err =>
      console.error('Failed to send event registration email:', err.message)
    );
  }
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
