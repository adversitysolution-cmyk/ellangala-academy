// Single source of truth for coupon discount math, used by the cart (browser)
// and re-checked on the server when an order is placed.

export const COUPON_TYPES = ['percent', 'fixed'];

// Returns the discount amount (whole rupees) a coupon gives on a subtotal.
// Returns 0 when the coupon does not apply (below minimum, etc.).
export function computeDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  const sub = Number(subtotal) || 0;
  const value = Number(coupon.value) || 0;
  if (sub <= 0 || value <= 0) return 0;
  if (sub < (Number(coupon.minSubtotal) || 0)) return 0;

  let discount = coupon.type === 'fixed' ? value : Math.round((sub * value) / 100);
  const cap = Number(coupon.maxDiscount) || 0;
  if (cap > 0) discount = Math.min(discount, cap);
  return Math.min(discount, sub);
}

// Whether a coupon is usable right now, ignoring the cart (rules the admin sets).
// `now` is injectable for testing. Returns { ok, error }.
export function checkCouponUsable(coupon, now = new Date()) {
  if (!coupon) return { ok: false, error: 'Coupon not found.' };
  if (!coupon.active) return { ok: false, error: 'This coupon is no longer active.' };
  if (coupon.expiresAt) {
    // expiresAt is a date (inclusive) — valid through end of that day.
    const expiry = new Date(coupon.expiresAt);
    expiry.setHours(23, 59, 59, 999);
    if (now > expiry) return { ok: false, error: 'This coupon has expired.' };
  }
  const limit = Number(coupon.usageLimit) || 0;
  if (limit > 0 && (Number(coupon.usedCount) || 0) >= limit) {
    return { ok: false, error: 'This coupon has reached its usage limit.' };
  }
  return { ok: true };
}
