import {
  mapRow, validateParticipant, markDuplicates, matchRegistration, normalizePhone, normalizeEmail
} from './participantValidation.js';

// Turns raw spreadsheet rows into classified participant records.
// Pure — the route supplies registrations + already-issued emails.
//
// status: READY | INVALID | DUPLICATE | UNMATCHED | ALREADY_CERTIFIED
// (EXCLUDED is only ever set later by a host edit.)
export function classifyParticipants({
  rawRows, mapping, phoneRequired = false,
  requireRegistrationMatch = true, registrations = [], existingCertificateEmails = []
}) {
  const byEmail = new Map();
  const byPhone = new Map();
  for (const r of registrations) {
    const e = normalizeEmail(r.email);
    const p = normalizePhone(r.phone);
    if (e && !byEmail.has(e)) byEmail.set(e, r);
    if (p && !byPhone.has(p)) byPhone.set(p, r);
  }
  const certified = new Set(existingCertificateEmails.map(normalizeEmail));

  const mapped = markDuplicates(rawRows.map((row) => mapRow(row, mapping)));

  const participants = mapped.map((row) => {
    const { errors } = validateParticipant(row, { phoneRequired });
    const match = errors.length ? null : matchRegistration(row, byEmail, byPhone);
    let status = 'READY';
    if (errors.length) status = 'INVALID';
    else if (row.duplicate) status = 'DUPLICATE';
    else if (certified.has(row.email)) status = 'ALREADY_CERTIFIED';
    else if (requireRegistrationMatch && !match) status = 'UNMATCHED';
    return {
      name: row.name,
      email: row.email,
      phone: row.phone,
      registrationId: match ? match.id : null,
      validationErrors: errors,
      status,
      eligible: status === 'READY'
    };
  });

  return { participants, counts: countByStatus(participants) };
}

export function countByStatus(participants) {
  const c = { total: participants.length, READY: 0, INVALID: 0, DUPLICATE: 0, UNMATCHED: 0, ALREADY_CERTIFIED: 0, EXCLUDED: 0 };
  for (const p of participants) c[p.status] = (c[p.status] || 0) + 1;
  return c;
}

// Re-runs validation for a single host-edited row (name/email/phone changed).
export function revalidateParticipant(row, { phoneRequired = false } = {}) {
  const norm = mapRow({ n: row.name, e: row.email, p: row.phone }, { name: 'n', email: 'e', phone: 'p' });
  const { errors } = validateParticipant(norm, { phoneRequired });
  return { ...norm, validationErrors: errors };
}
