import crypto from 'crypto';

// Short event code from the title, e.g. "Bhagavadgita for Meaningful Life" -> "BML".
// Falls back to a slice of the event id so the code is never empty.
export function deriveEventCode(event) {
  const words = String(event?.title || '')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['for', 'the', 'and', 'with'].includes(w.toLowerCase()));
  const code = words.map((w) => w[0]).join('').toUpperCase().slice(0, 4);
  return code || String(event?.id || 'EVT').replace(/[^A-Z0-9]/gi, '').slice(-3).toUpperCase();
}

// Builds a certificate number from a format string.
// Tokens: {org} {event} {year} {seq}. Default: "{org}-{event}-{year}-{seq}".
// seq is 1-based and zero-padded to 6 digits.
export function buildCertificateNumber({ format, org = 'ELA', eventCode, year, sequence }) {
  const tpl = format || '{org}-{event}-{year}-{seq}';
  return tpl
    .replace(/\{org\}/g, org)
    .replace(/\{event\}/g, eventCode)
    .replace(/\{year\}/g, String(year))
    .replace(/\{seq\}/g, String(sequence).padStart(6, '0'));
}

// Unguessable public verification token — the real security boundary,
// never the sequential certificate number.
export function generateVerificationToken() {
  return crypto.randomBytes(24).toString('hex');
}
