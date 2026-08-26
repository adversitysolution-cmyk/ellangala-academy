import { Router } from 'express';
import { verifyCredentials, createSession } from '../middleware/adminAuth.js';

const router = Router();

// Public: POST /api/admin/login
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!verifyCredentials(email, password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = createSession(email);
  res.json({
    token,
    user: {
      name: 'Academy Administrator',
      email: (email || '').trim().toLowerCase(),
      role: 'Administrator',
      avatar: '/assets/images/resources/testi-v1-img1.jpg'
    }
  });
});

export default router;
