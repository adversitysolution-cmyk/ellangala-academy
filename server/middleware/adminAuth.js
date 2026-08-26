import crypto from 'crypto';

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12h

// ponytail: in-memory session store — lost on server restart, not multi-instance
// safe. Move to the same JSON store (or redis) if the site ever runs more than
// one server process or needs sessions to survive a restart.
const sessions = new Map();

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set — no default admin credentials are shipped in code.');
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(email, password) {
  const emailMatch = (email || '').trim().toLowerCase() === ADMIN_EMAIL;
  const passwordMatch = timingSafeStringEqual(String(password || ''), ADMIN_PASSWORD);
  return emailMatch && passwordMatch;
}

export function createSession(email) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { email, expiresAt: Date.now() + TOKEN_TTL_MS });
  return token;
}

export function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const session = token ? sessions.get(token) : null;

  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.adminEmail = session.email;
  next();
}
