import crypto from 'crypto';
import multer from 'multer';
import { asyncRouter } from '../lib/asyncRouter.js';
import { uploadsDir } from './uploadApi.js';
import {
  getCommunityCategories,
  getCommunityPosts,
  getCommunityPostById,
  saveCommunityPost,
  deleteCommunityPost,
  togglePinCommunityPost,
  toggleCommunityLike,
  toggleCommunitySave,
  getCommunityComments,
  createCommunityComment,
  getAdminCommunityComments,
  updateCommunityCommentStatus,
  deleteCommunityComment,
  getCommunitySidebarData,
  createCommunityUser,
  authenticateCommunityUser,
  getCommunityUserByToken,
  updateCommunityUserProfile,
  logoutCommunityUser,
  getCommunityUserLearning,
  getCommunityUserWorkshops
} from '../db/communityStore.js';

const router = asyncRouter();

// Multer storage for community media (images, posters, audio, video snippets)
const ALLOWED_COMMUNITY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/wav': '.wav',
  'video/mp4': '.mp4',
  'video/webm': '.webm'
};

const communityUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = ALLOWED_COMMUNITY_MIME[file.mimetype] || '.jpg';
      cb(null, `community-${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    }
  }),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_COMMUNITY_MIME[file.mimetype]) {
      return cb(new Error('Allowed formats: JPEG, PNG, WEBP, GIF, MP3, WAV, MP4, WEBM'));
    }
    cb(null, true);
  }
});

function extractBearerToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return req.query.token || req.body?.token || null;
}

// ============================================================================
// COMMUNITY AUTHENTICATION & SESSIONS (30-Day Persistence)
// ============================================================================

// POST /api/community/auth/signup
router.post('/community/auth/signup', async (req, res) => {
  const { name, phone, email, password, avatarUrl, topics } = req.body;
  try {
    const user = await createCommunityUser({ name, phone, email, password, avatarUrl, topics });
    res.status(201).json({
      success: true,
      user,
      token: user.token,
      tokenExpiresAt: user.tokenExpiresAt,
      message: 'Welcome to Ellangala Community!'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/community/auth/login
router.post('/community/auth/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await authenticateCommunityUser({ identifier, password });
    res.json({
      success: true,
      user,
      token: user.token,
      tokenExpiresAt: user.tokenExpiresAt,
      message: 'Signed in successfully.'
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// GET /api/community/auth/me
router.get('/community/auth/me', async (req, res) => {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided.' });
  }
  const user = await getCommunityUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
  res.json({ success: true, user });
});

// POST /api/community/auth/logout
router.post('/community/auth/logout', async (req, res) => {
  const token = extractBearerToken(req);
  if (token) {
    await logoutCommunityUser(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// PATCH /api/community/auth/profile
router.patch('/community/auth/profile', async (req, res) => {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    const user = await updateCommunityUserProfile(token, req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/community/auth/upload-avatar
router.post('/community/auth/upload-avatar', (req, res) => {
  communityUpload.single('avatar')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No avatar image uploaded.' });
    res.json({ avatarUrl: `/uploads/${req.file.filename}` });
  });
});

// GET /api/community/user/learning
router.get('/community/user/learning', async (req, res) => {
  const token = extractBearerToken(req);
  const data = await getCommunityUserLearning(token);
  res.json(data);
});

// GET /api/community/user/workshops
router.get('/community/user/workshops', async (req, res) => {
  const token = extractBearerToken(req);
  const data = await getCommunityUserWorkshops(token);
  res.json(data);
});

// ============================================================================
// PUBLIC ENDPOINTS
// ============================================================================

// GET /api/community/categories
router.get('/community/categories', async (req, res) => {
  const categories = await getCommunityCategories();
  res.json(categories);
});

// GET /api/community/posts
router.get('/community/posts', async (req, res) => {
  const { category, filter, page, limit, search, visitorId } = req.query;
  const result = await getCommunityPosts({
    category,
    filter,
    page,
    limit,
    search,
    includeDrafts: false,
    visitorId
  });
  res.json(result);
});

// GET /api/community/posts/:id
router.get('/community/posts/:id', async (req, res) => {
  const { visitorId } = req.query;
  const post = await getCommunityPostById(req.params.id, { includeDrafts: false, visitorId });
  if (!post) {
    return res.status(404).json({ error: 'Post not found or not published.' });
  }
  res.json(post);
});

// GET /api/community/posts/:id/comments
router.get('/community/posts/:id/comments', async (req, res) => {
  const { page, limit } = req.query;
  const result = await getCommunityComments(req.params.id, { page, limit, includeHidden: false });
  res.json(result);
});

// POST /api/community/posts/:id/comments
router.post('/community/posts/:id/comments', async (req, res) => {
  const { authorName, authorEmail, content, visitorId } = req.body;
  if (!authorName?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Name and comment text are required.' });
  }

  // Ensure target post exists and is published
  const post = await getCommunityPostById(req.params.id, { includeDrafts: false });
  if (!post) {
    return res.status(404).json({ error: 'Cannot comment on an unpublished post.' });
  }

  const comment = await createCommunityComment({
    postId: req.params.id,
    authorName,
    authorEmail,
    content,
    visitorId
  });

  res.status(201).json(comment);
});

// POST /api/community/posts/:id/like
router.post('/community/posts/:id/like', async (req, res) => {
  const { visitorId } = req.body;
  if (!visitorId?.trim()) {
    return res.status(400).json({ error: 'visitorId is required to record like.' });
  }

  try {
    const result = await toggleCommunityLike(req.params.id, visitorId.trim());
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/community/posts/:id/save
router.post('/community/posts/:id/save', async (req, res) => {
  const { visitorId } = req.body;
  if (!visitorId?.trim()) {
    return res.status(400).json({ error: 'visitorId is required to save post.' });
  }

  try {
    const result = await toggleCommunitySave(req.params.id, visitorId.trim());
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/community/sidebar-data
router.get('/community/sidebar-data', async (req, res) => {
  const channel = req.query.channel || req.query.category || 'all';
  const data = await getCommunitySidebarData(channel);
  res.json(data);
});

// ============================================================================
// ADMIN ENDPOINTS (Protected automatically by server/index.js /api/admin guard)
// ============================================================================

// GET /api/admin/community/posts
router.get('/admin/community/posts', async (req, res) => {
  const { category, filter, page, limit, search, status } = req.query;
  const result = await getCommunityPosts({
    category,
    filter,
    page,
    limit,
    search,
    status: status || 'all',
    includeDrafts: true
  });
  res.json(result);
});

// GET /api/admin/community/posts/:id
router.get('/admin/community/posts/:id', async (req, res) => {
  const post = await getCommunityPostById(req.params.id, { includeDrafts: true });
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  res.json(post);
});

// POST /api/admin/community/posts
router.post('/admin/community/posts', async (req, res) => {
  try {
    const saved = await saveCommunityPost(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/community/posts/:id
router.put('/admin/community/posts/:id', async (req, res) => {
  try {
    const saved = await saveCommunityPost({ ...req.body, id: req.params.id });
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/community/posts/:id
router.delete('/admin/community/posts/:id', async (req, res) => {
  const success = await deleteCommunityPost(req.params.id);
  if (success) {
    res.json({ success: true, message: 'Community post deleted successfully.' });
  } else {
    res.status(404).json({ error: 'Post not found.' });
  }
});

// PATCH /api/admin/community/posts/:id/pin
router.patch('/admin/community/posts/:id/pin', async (req, res) => {
  const { isPinned } = req.body;
  try {
    const updated = await togglePinCommunityPost(req.params.id, Boolean(isPinned));
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/admin/community/comments
router.get('/admin/community/comments', async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await getAdminCommunityComments({ status: status || 'all', page, limit });
  res.json(result);
});

// PATCH /api/admin/community/comments/:id/status
router.patch('/admin/community/comments/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await updateCommunityCommentStatus(req.params.id, status);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/community/comments/:id
router.delete('/admin/community/comments/:id', async (req, res) => {
  const success = await deleteCommunityComment(req.params.id);
  if (success) {
    res.json({ success: true, message: 'Comment deleted successfully.' });
  } else {
    res.status(404).json({ error: 'Comment not found.' });
  }
});

// POST /api/admin/community/upload-media (supports single or multiple file uploads)
router.post('/admin/community/upload-media', (req, res) => {
  communityUpload.array('media', 10)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No media files uploaded.' });
    }

    const uploaded = req.files.map((file, idx) => {
      const isVideo = file.mimetype.startsWith('video/');
      const isAudio = file.mimetype.startsWith('audio/');
      return {
        id: `media-${Date.now()}-${idx}`,
        mediaType: isVideo ? 'video' : isAudio ? 'audio' : 'image',
        mediaUrl: `/uploads/${file.filename}`,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        displayOrder: idx + 1
      };
    });

    res.status(201).json({ media: uploaded });
  });
});

export default router;
