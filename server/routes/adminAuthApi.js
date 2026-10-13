import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import multer from 'multer';
import { verifyCredentials, createSession, requireAdminAuth } from '../middleware/adminAuth.js';
import { syncAdminProfileToPosts } from '../db/communityStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PROFILE_FILE = path.join(uploadsDir, 'admin-profile.json');

const DEFAULT_PROFILE = {
  name: 'Academy Administrator',
  email: 'admin@ellangala.com',
  role: 'Administrator',
  avatar: '/assets/images/resources/founder-avatar.png'
};

function getAdminProfile() {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf-8'));
      return { ...DEFAULT_PROFILE, ...data };
    }
  } catch (err) {
    console.error('Error reading admin profile:', err);
  }
  return { ...DEFAULT_PROFILE };
}

function saveAdminProfile(profile) {
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing admin profile:', err);
  }
}

// Multer config for Admin Profile Avatar (2MB Maximum limit)
const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
};

const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = ALLOWED_IMAGE_TYPES[file.mimetype] || '.jpg';
      cb(null, `admin-avatar-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES[file.mimetype]) {
      return cb(new Error('Only JPEG, PNG, WEBP, and GIF images are supported.'));
    }
    cb(null, true);
  }
});

const router = Router();

// Public: POST /api/admin/login
router.post('/admin/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!verifyCredentials(email, password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = createSession(email);
  const profile = getAdminProfile();
  if (email) {
    profile.email = email.trim().toLowerCase();
  }

  res.json({
    token,
    user: profile
  });
});

// Protected: GET /api/admin/profile
router.get('/admin/profile', requireAdminAuth, (req, res) => {
  const profile = getAdminProfile();
  res.json({ success: true, profile });
});

// Protected: PATCH /api/admin/profile
router.patch('/admin/profile', requireAdminAuth, async (req, res) => {
  const { name, role, email, avatar } = req.body || {};
  const current = getAdminProfile();
  const updated = {
    ...current,
    ...(name !== undefined && String(name).trim() ? { name: String(name).trim() } : {}),
    ...(role !== undefined && String(role).trim() ? { role: String(role).trim() } : {}),
    ...(email !== undefined && String(email).trim() ? { email: String(email).trim().toLowerCase() } : {}),
    ...(avatar !== undefined ? { avatar: String(avatar).trim() } : {})
  };

  saveAdminProfile(updated);
  await syncAdminProfileToPosts(updated);
  res.json({ success: true, profile: updated });
});

// Protected: POST /api/admin/profile/avatar (Max 2MB file upload)
router.post('/admin/profile/avatar', requireAdminAuth, (req, res) => {
  avatarUpload.single('avatar')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Profile image exceeds 2MB maximum limit. Please choose a file up to 2MB.' });
      }
      return res.status(400).json({ error: err.message || 'Avatar upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const current = getAdminProfile();
    const updated = {
      ...current,
      avatar: avatarUrl
    };

    saveAdminProfile(updated);
    await syncAdminProfileToPosts(updated);
    res.json({
      success: true,
      avatarUrl,
      profile: updated,
      message: 'Admin profile image updated successfully.'
    });
  });
});

// Protected: DELETE /api/admin/profile/avatar (Removes admin profile photo)
router.delete('/admin/profile/avatar', requireAdminAuth, async (req, res) => {
  const current = getAdminProfile();
  const updated = {
    ...current,
    avatar: ''
  };

  saveAdminProfile(updated);
  await syncAdminProfileToPosts(updated);
  res.json({
    success: true,
    profile: updated,
    message: 'Profile photo removed successfully.'
  });
});

export default router;
