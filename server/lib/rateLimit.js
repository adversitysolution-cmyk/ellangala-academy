// Tiny fixed-window limiter. Per-process (fine for one server instance).
// ponytail: in-memory Map — swap for redis only if the app goes multi-instance.
export function rateLimit({ windowMs, max }) {
  const hits = new Map();
  return (req, res, next) => {
    const key = req.ip || req.connection?.remoteAddress || 'anon';
    const nowT = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt < nowT) {
      hits.set(key, { count: 1, resetAt: nowT + windowMs });
      return next();
    }
    if (entry.count >= max) {
      return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
    }
    entry.count++;
    next();
  };
}
