import {
  getDbCoupons,
  saveDbCoupon,
  deleteDbCoupon,
  validateDbCoupon
} from '../db/store.js';
import { asyncRouter } from '../lib/asyncRouter.js';

const router = asyncRouter();

// Public: POST /api/coupons/validate  { code, subtotal }
router.post('/coupons/validate', async (req, res) => {
  const { code, subtotal } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Enter a coupon code.' });

  const result = await validateDbCoupon(code, Number(subtotal) || 0);
  if (!result.ok) return res.status(400).json({ error: result.error });

  const { coupon, discount } = result;
  res.json({
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    minSubtotal: coupon.minSubtotal,
    maxDiscount: coupon.maxDiscount,
    discount,
    description: coupon.description
  });
});

// Admin: GET /api/admin/coupons
router.get('/admin/coupons', async (req, res) => {
  res.json(await getDbCoupons());
});

// Admin: POST /api/admin/coupons
router.post('/admin/coupons', async (req, res) => {
  try {
    const created = await saveDbCoupon(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: PUT /api/admin/coupons/:id
router.put('/admin/coupons/:id', async (req, res) => {
  try {
    const updated = await saveDbCoupon({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: DELETE /api/admin/coupons/:id
router.delete('/admin/coupons/:id', async (req, res) => {
  const ok = await deleteDbCoupon(req.params.id);
  if (ok) return res.json({ success: true });
  res.status(404).json({ error: 'Coupon not found' });
});

export default router;
