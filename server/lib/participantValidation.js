const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeName(v) {
  return String(v || '').replace(/\s+/g, ' ').trim();
}

export function normalizeEmail(v) {
  return String(v || '').trim().toLowerCase();
}

export function normalizePhone(v) {
  const digits = String(v || '').replace(/[^\d+]/g, '');
  // keep last 10 digits as the comparison key (handles +91 / 0 prefixes)
  const bare = digits.replace(/\D/g, '');
  return bare.length >= 10 ? bare.slice(-10) : bare;
}

// Maps one raw spreadsheet row through the column mapping and normalizes it.
export function mapRow(rawRow, mapping) {
  return {
    name: normalizeName(rawRow[mapping.name]),
    email: normalizeEmail(rawRow[mapping.email]),
    phone: normalizePhone(rawRow[mapping.phone])
  };
}

// Returns { errors: string[] } — empty means the row is structurally valid.
export function validateParticipant(row, { phoneRequired = false } = {}) {
  const errors = [];
  if (!row.name) errors.push('Name is required');
  if (!row.email) errors.push('Email is required');
  else if (!EMAIL_RE.test(row.email)) errors.push('Invalid email address');
  if (phoneRequired && !row.phone) errors.push('Phone is required');
  return { errors };
}

// Flags duplicates within one uploaded file. Primary key: normalized email;
// secondary: normalized phone. First occurrence stays clean, rest are DUPLICATE.
export function markDuplicates(rows) {
  const seenEmail = new Set();
  const seenPhone = new Set();
  return rows.map((row) => {
    const dupEmail = row.email && seenEmail.has(row.email);
    const dupPhone = row.phone && seenPhone.has(row.phone);
    if (row.email) seenEmail.add(row.email);
    if (row.phone) seenPhone.add(row.phone);
    return { ...row, duplicate: Boolean(dupEmail || dupPhone) };
  });
}

// Matches an uploaded participant against event registrations.
// Primary: email. Secondary: phone. Name is never the identity key.
export function matchRegistration(row, registrationsByEmail, registrationsByPhone) {
  if (row.email && registrationsByEmail.has(row.email)) {
    return registrationsByEmail.get(row.email);
  }
  if (row.phone && registrationsByPhone.has(row.phone)) {
    return registrationsByPhone.get(row.phone);
  }
  return null;
}
