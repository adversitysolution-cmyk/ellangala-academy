import { asyncRouter } from '../lib/asyncRouter.js';
import {
  getCommunityUsers,
  updateCommunityUserStatus,
  deleteCommunityUser
} from '../db/communityStore.js';

const router = asyncRouter();

// GET /api/admin/users
// Supports query params: status (all|active|inactive|new), search, sort (newest|oldest|name-asc|name-desc), fromDate, toDate
router.get('/admin/users', async (req, res) => {
  const { status, search, sort, fromDate, toDate } = req.query;
  const result = await getCommunityUsers({ status, search, sort, fromDate, toDate });
  res.json({
    success: true,
    users: result.users,
    stats: result.stats
  });
});

// PATCH /api/admin/users/:id/status
router.patch('/admin/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ error: 'Status is required (active or inactive).' });
  }

  const updated = await updateCommunityUserStatus(id, status);
  res.json({
    success: true,
    user: updated,
    message: `User status changed to ${updated.status}.`
  });
});

// DELETE /api/admin/users/:id
router.delete('/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  await deleteCommunityUser(id);
  res.json({
    success: true,
    id,
    message: 'User removed successfully.'
  });
});

export default router;
