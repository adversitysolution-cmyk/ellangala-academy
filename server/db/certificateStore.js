import crypto from 'crypto';
import { pool } from './pool.js';

// --- small local helpers (mirrors server/db/store.js conventions) ---
const toIso = (v) => (v instanceof Date ? v.toISOString() : v);
const toBool = (v) => Boolean(v);
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
const parseJson = (v) => {
  if (v == null) return null;
  if (typeof v === 'object') return v;
  try { return JSON.parse(v); } catch { return null; }
};

async function nextId(table, prefix) {
  const year = new Date().getFullYear();
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS n FROM ${table} WHERE id LIKE ?`, [`${prefix}-${year}-%`]
  );
  return `${prefix}-${year}-${String(rows[0].n + 1).padStart(5, '0')}`;
}

// ======================= TEMPLATES =======================
function rowToTemplate(r) {
  return { ...r, isActive: toBool(r.isActive), createdAt: toIso(r.createdAt), updatedAt: toIso(r.updatedAt) };
}

export async function getTemplates() {
  const [rows] = await pool.query('SELECT * FROM certificate_templates ORDER BY pk DESC');
  return rows.map(rowToTemplate);
}

export async function getTemplateById(id) {
  const [rows] = await pool.query('SELECT * FROM certificate_templates WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? rowToTemplate(rows[0]) : null;
}

export async function getActiveTemplate() {
  const [rows] = await pool.query('SELECT * FROM certificate_templates WHERE isActive = 1 ORDER BY pk DESC LIMIT 1');
  return rows[0] ? rowToTemplate(rows[0]) : null;
}

const TEMPLATE_FIELDS = ['name', 'organizationName', 'signatoryName', 'signatoryTitle', 'address',
  'headingText', 'bodyText', 'logoUrl', 'signatureUrl', 'sealUrl', 'backgroundUrl', 'isActive'];

export async function saveTemplate(data) {
  const ts = now();
  let existing = data.id ? await getTemplateById(data.id) : null;
  const merged = { ...existing, ...data };
  const values = TEMPLATE_FIELDS.map((f) => (f === 'isActive'
    ? (merged.isActive === undefined ? true : Boolean(merged.isActive))
    : (merged[f] ?? null)));

  if (existing) {
    await pool.query(
      `UPDATE certificate_templates SET ${TEMPLATE_FIELDS.map((f) => `${f}=?`).join(', ')}, updatedAt=? WHERE id=?`,
      [...values, ts, existing.id]
    );
    return getTemplateById(existing.id);
  }
  const id = await nextId('certificate_templates', 'CTPL');
  await pool.query(
    `INSERT INTO certificate_templates (id, ${TEMPLATE_FIELDS.join(', ')}, createdAt, updatedAt)
     VALUES (?, ${TEMPLATE_FIELDS.map(() => '?').join(', ')}, ?, ?)`,
    [id, ...values, ts, ts]
  );
  return getTemplateById(id);
}

// Seeded once on boot so the module has a working default template.
export async function seedCertificateDefaults() {
  const [[{ n }]] = await pool.query('SELECT COUNT(*) AS n FROM certificate_templates');
  if (n > 0) return;
  await saveTemplate({
    name: 'Ellangala’s Academy — Default',
    organizationName: 'Ellangala’s Academy',
    signatoryName: 'Dr. Naveen Ellangala',
    signatoryTitle: 'Founder',
    address: 'Nayandahalli, Outer Ring Road, Bengaluru',
    headingText: 'Certificate of Completion',
    bodyText:
      'This is to certify that {{participant_name}} has successfully completed the "{{event_name}}" course at {{organization_name}}, {{event_date_text}}.',
    isActive: true
  });
}

// ======================= EVENT CONFIG =======================
function rowToConfig(r) {
  return {
    ...r,
    certificateEnabled: toBool(r.certificateEnabled),
    requireRegistrationMatch: toBool(r.requireRegistrationMatch),
    autoSendEmail: toBool(r.autoSendEmail),
    createdAt: toIso(r.createdAt), updatedAt: toIso(r.updatedAt)
  };
}

export async function getCertConfig(eventId) {
  const [rows] = await pool.query('SELECT * FROM event_certificate_configs WHERE eventId = ? LIMIT 1', [eventId]);
  return rows[0] ? rowToConfig(rows[0]) : null;
}

export async function getOrCreateCertConfig(eventId) {
  const existing = await getCertConfig(eventId);
  if (existing) return existing;
  const ts = now();
  const id = await nextId('event_certificate_configs', 'ECFG');
  const active = await getActiveTemplate();
  await pool.query(
    `INSERT INTO event_certificate_configs (id, eventId, templateId, createdAt, updatedAt) VALUES (?,?,?,?,?)`,
    [id, eventId, active ? active.id : null, ts, ts]
  );
  return getCertConfig(eventId);
}

const CONFIG_FIELDS = ['templateId', 'certificateEnabled', 'eligibilityMode', 'requireRegistrationMatch',
  'autoSendEmail', 'idFormat', 'orgCode', 'eventCode'];

export async function saveCertConfig(eventId, patch) {
  await getOrCreateCertConfig(eventId);
  const current = await getCertConfig(eventId);
  const merged = { ...current, ...patch };
  await pool.query(
    `UPDATE event_certificate_configs SET ${CONFIG_FIELDS.map((f) => `${f}=?`).join(', ')}, updatedAt=? WHERE eventId=?`,
    [...CONFIG_FIELDS.map((f) => (typeof current[f] === 'boolean' || ['certificateEnabled', 'requireRegistrationMatch', 'autoSendEmail'].includes(f)
      ? Boolean(merged[f]) : (merged[f] ?? null))), now(), eventId]
  );
  return getCertConfig(eventId);
}

// ======================= IMPORT BATCHES =======================
function rowToBatch(r, { withRows = false } = {}) {
  const b = {
    ...r,
    headers: parseJson(r.headers) || [],
    columnMapping: parseJson(r.columnMapping) || {},
    phoneRequired: toBool(r.phoneRequired),
    createdAt: toIso(r.createdAt), updatedAt: toIso(r.updatedAt)
  };
  if (withRows) b.rawRows = parseJson(r.rawRows) || [];
  else delete b.rawRows;
  return b;
}

export async function createBatch({ eventId, uploadedBy, fileName, headers, columnMapping, rawRows }) {
  const ts = now();
  const id = await nextId('certificate_import_batches', 'CBAT');
  await pool.query(
    `INSERT INTO certificate_import_batches (id, eventId, uploadedBy, fileName, headers, columnMapping, rawRows, totalRows, status, createdAt, updatedAt)
     VALUES (?,?,?,?,?,?,?,?,'mapping',?,?)`,
    [id, eventId, uploadedBy || null, fileName || null, JSON.stringify(headers || []),
      JSON.stringify(columnMapping || {}), JSON.stringify(rawRows || []), (rawRows || []).length, ts, ts]
  );
  return getBatch(id);
}

export async function getBatch(id, opts) {
  const [rows] = await pool.query('SELECT * FROM certificate_import_batches WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? rowToBatch(rows[0], opts) : null;
}

export async function updateBatch(id, patch) {
  const fields = ['columnMapping', 'phoneRequired', 'totalRows', 'validRows', 'invalidRows', 'duplicateRows', 'status'];
  const set = [], vals = [];
  for (const f of fields) {
    if (patch[f] === undefined) continue;
    set.push(`${f}=?`);
    vals.push(f === 'columnMapping' ? JSON.stringify(patch[f]) : (f === 'phoneRequired' ? Boolean(patch[f]) : patch[f]));
  }
  if (!set.length) return getBatch(id);
  vals.push(now(), id);
  await pool.query(`UPDATE certificate_import_batches SET ${set.join(', ')}, updatedAt=? WHERE id=?`, vals);
  return getBatch(id);
}

export async function listBatches(eventId) {
  const [rows] = await pool.query('SELECT * FROM certificate_import_batches WHERE eventId = ? ORDER BY pk DESC', [eventId]);
  return rows.map(rowToBatch);
}

// ======================= PARTICIPANT IMPORTS =======================
function rowToParticipant(r) {
  return {
    ...r,
    validationErrors: parseJson(r.validationErrors) || [],
    eligible: toBool(r.eligible),
    createdAt: toIso(r.createdAt), updatedAt: toIso(r.updatedAt)
  };
}

// Replaces all rows for a batch (re-mapping columns re-derives everything).
export async function replaceParticipants(batchId, eventId, participants) {
  await pool.query('DELETE FROM certificate_participant_imports WHERE batchId = ?', [batchId]);
  if (!participants.length) return;
  const ts = now();
  const year = new Date().getFullYear();
  const [[{ n }]] = await pool.query(
    'SELECT COUNT(*) AS n FROM certificate_participant_imports WHERE id LIKE ?', [`CPI-${year}-%`]
  );
  const values = participants.map((p, i) => [
    `CPI-${year}-${String(n + i + 1).padStart(6, '0')}`,
    batchId, eventId, p.registrationId || null, p.name || null, p.email || null, p.phone || null,
    p.status || 'READY', JSON.stringify(p.validationErrors || []), Boolean(p.eligible), ts, ts
  ]);
  await pool.query(
    `INSERT INTO certificate_participant_imports
     (id, batchId, eventId, registrationId, name, email, phone, status, validationErrors, eligible, createdAt, updatedAt)
     VALUES ?`,
    [values]
  );
}

export async function getParticipant(id) {
  const [rows] = await pool.query('SELECT * FROM certificate_participant_imports WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? rowToParticipant(rows[0]) : null;
}

export async function getBatchParticipants(batchId) {
  const [rows] = await pool.query(
    'SELECT * FROM certificate_participant_imports WHERE batchId = ? ORDER BY pk ASC', [batchId]
  );
  return rows.map(rowToParticipant);
}

export async function updateParticipant(id, patch) {
  const fields = ['name', 'email', 'phone', 'status', 'eligible', 'validationErrors', 'registrationId', 'certificateId'];
  const set = [], vals = [];
  for (const f of fields) {
    if (patch[f] === undefined) continue;
    set.push(`${f}=?`);
    vals.push(f === 'validationErrors' ? JSON.stringify(patch[f]) : (f === 'eligible' ? Boolean(patch[f]) : patch[f]));
  }
  if (!set.length) return getParticipant(id);
  vals.push(now(), id);
  await pool.query(`UPDATE certificate_participant_imports SET ${set.join(', ')}, updatedAt=? WHERE id=?`, vals);
  return getParticipant(id);
}

// ======================= REGISTRATION MATCH SOURCE =======================
// Event registrations live in `enrollments` (sourceType='Event').
export async function getEventRegistrations(eventId, eventTitle) {
  const [rows] = await pool.query(
    `SELECT id, email, phone, fullName FROM enrollments
     WHERE eventId = ? OR (sourceType = 'Event' AND (eventTitle = ? OR interest = ?))`,
    [eventId, eventTitle || '', eventTitle || '']
  );
  return rows;
}

export async function countEventRegistrations(eventId, eventTitle) {
  return (await getEventRegistrations(eventId, eventTitle)).length;
}

// ======================= CERTIFICATES =======================
function rowToCertificate(r) {
  return {
    ...r,
    issuedAt: toIso(r.issuedAt), revokedAt: toIso(r.revokedAt),
    createdAt: toIso(r.createdAt), updatedAt: toIso(r.updatedAt)
  };
}

export async function getCertificateById(id) {
  const [rows] = await pool.query('SELECT * FROM certificates WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? rowToCertificate(rows[0]) : null;
}

export async function getCertificateByNumber(certificateNumber) {
  const [rows] = await pool.query('SELECT * FROM certificates WHERE certificateNumber = ? LIMIT 1', [certificateNumber]);
  return rows[0] ? rowToCertificate(rows[0]) : null;
}

export async function getCertificateByToken(token) {
  const [rows] = await pool.query('SELECT * FROM certificates WHERE verificationToken = ? LIMIT 1', [token]);
  return rows[0] ? rowToCertificate(rows[0]) : null;
}

export async function getCertificateByParticipant(eventId, email) {
  const [rows] = await pool.query(
    'SELECT * FROM certificates WHERE eventId = ? AND participantEmail = ? LIMIT 1', [eventId, email]
  );
  return rows[0] ? rowToCertificate(rows[0]) : null;
}

export async function getActiveCertificateEmails(eventId) {
  const [rows] = await pool.query(
    `SELECT participantEmail FROM certificates WHERE eventId = ? AND status = 'active'`, [eventId]
  );
  return rows.map((r) => r.participantEmail);
}

export async function countCertificates(eventId) {
  const [[{ n }]] = await pool.query('SELECT COUNT(*) AS n FROM certificates WHERE eventId = ?', [eventId]);
  return n;
}

// Plain insert — callers dedupe via getCertificateByParticipant first, and the
// (eventId, participantEmail) unique key is the backstop against a double upload.
export async function insertCertificate(data) {
  const ts = now();
  const id = await nextId('certificates', 'CERT');
  try {
    await pool.query(
      `INSERT INTO certificates
       (id, certificateNumber, verificationToken, eventId, registrationId, batchId,
        participantName, participantEmail, participantPhone, templateId, status, issuedAt, createdAt, updatedAt)
       VALUES (?,?,?,?,?,?,?,?,?,?,'active',?,?,?)`,
      [id, data.certificateNumber, data.verificationToken, data.eventId, data.registrationId || null,
        data.batchId || null, data.participantName || null, data.participantEmail || null,
        data.participantPhone || null, data.templateId || null, ts, ts, ts]
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return { created: false, certificate: await getCertificateByParticipant(data.eventId, data.participantEmail) };
    throw err;
  }
  return { created: true, certificate: await getCertificateById(id) };
}

export async function setCertificatePdf(id, pdfPath) {
  await pool.query('UPDATE certificates SET pdfPath = ?, updatedAt = ? WHERE id = ?', [pdfPath, now(), id]);
}

export async function revokeCertificate(id, reason) {
  const ts = now();
  await pool.query(
    `UPDATE certificates SET status = 'revoked', revokedAt = ?, revocationReason = ?, updatedAt = ? WHERE id = ?`,
    [ts, reason || null, ts, id]
  );
  return getCertificateById(id);
}

export async function listCertificates(eventId, { search = '', filter = 'all' } = {}) {
  const where = ['c.eventId = ?'];
  const params = [eventId];
  if (search) {
    where.push('(c.participantName LIKE ? OR c.participantEmail LIKE ? OR c.certificateNumber LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (filter === 'revoked') where.push("c.status = 'revoked'");
  if (filter === 'generated') where.push("c.status = 'active' AND c.pdfPath IS NOT NULL");
  if (filter === 'email_sent') where.push("e.status = 'SENT'");
  if (filter === 'email_failed') where.push("e.status = 'FAILED'");

  const [rows] = await pool.query(
    `SELECT c.*, e.status AS emailStatus, e.sentAt AS emailSentAt, e.retryCount AS emailRetryCount
     FROM certificates c
     LEFT JOIN certificate_emails e ON e.certificateId = c.id
     WHERE ${where.join(' AND ')}
     ORDER BY c.pk DESC`,
    params
  );
  return rows.map((r) => ({ ...rowToCertificate(r), emailStatus: r.emailStatus || 'PENDING' }));
}

// Single aggregate query — no N+1.
export async function getEventCertStats(eventId) {
  const [[certs]] = await pool.query(
    `SELECT
       COUNT(*) AS totalCount,
       SUM(status = 'active' AND pdfPath IS NOT NULL) AS genCount,
       SUM(status = 'active' AND pdfPath IS NULL) AS procCount,
       SUM(status = 'revoked') AS revCount
     FROM certificates WHERE eventId = ?`, [eventId]
  );
  const [[emails]] = await pool.query(
    `SELECT
       SUM(e.status = 'SENT') AS sentCount,
       SUM(e.status = 'FAILED') AS failCount,
       SUM(e.status = 'PENDING') AS pendCount
     FROM certificate_emails e JOIN certificates c ON c.id = e.certificateId
     WHERE c.eventId = ?`, [eventId]
  );
  return {
    generated: Number(certs.genCount) || 0,
    processing: Number(certs.procCount) || 0,
    revoked: Number(certs.revCount) || 0,
    total: Number(certs.totalCount) || 0,
    emailsSent: Number(emails.sentCount) || 0,
    emailsFailed: Number(emails.failCount) || 0,
    emailsPending: Number(emails.pendCount) || 0
  };
}

// ======================= JOBS =======================
export async function enqueueJob({ type, certificateId, batchId = null, force = false }) {
  const ts = now();
  // Random id — job rows are created concurrently by the worker, so a
  // COUNT-based sequence (nextId) would race and collide.
  const id = `CJOB-${Date.now().toString(36)}-${crypto.randomBytes(5).toString('hex')}`;
  await pool.query(
    `INSERT INTO certificate_jobs (id, type, certificateId, batchId, status, forced, createdAt, updatedAt)
     VALUES (?,?,?,?,'pending',?,?,?)`,
    [id, type, certificateId, batchId, Boolean(force), ts, ts]
  );
  return id;
}

export async function hasOpenJob(type, certificateId) {
  const [[{ n }]] = await pool.query(
    `SELECT COUNT(*) AS n FROM certificate_jobs WHERE type = ? AND certificateId = ? AND status IN ('pending','processing')`,
    [type, certificateId]
  );
  return n > 0;
}

export async function claimPendingJobs(limit) {
  const [rows] = await pool.query(
    `SELECT * FROM certificate_jobs WHERE status = 'pending' ORDER BY pk ASC LIMIT ?`, [limit]
  );
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  await pool.query(
    `UPDATE certificate_jobs SET status = 'processing', attempts = attempts + 1, updatedAt = ?
     WHERE id IN (${ids.map(() => '?').join(',')})`,
    [now(), ...ids]
  );
  return rows.map((r) => ({ ...r, force: toBool(r.forced) }));
}

export async function completeJob(id) {
  await pool.query(`UPDATE certificate_jobs SET status = 'done', lastError = NULL, updatedAt = ? WHERE id = ?`, [now(), id]);
}

export async function failJob(id, message, { retry = true } = {}) {
  await pool.query(
    `UPDATE certificate_jobs SET status = ?, lastError = ?, updatedAt = ? WHERE id = ?`,
    [retry ? 'pending' : 'failed', String(message || '').slice(0, 500), now(), id]
  );
}

// Crash recovery: anything left 'processing' from a previous run goes back to the queue.
export async function resetStuckJobs() {
  await pool.query(`UPDATE certificate_jobs SET status = 'pending' WHERE status = 'processing'`);
  // give up on jobs that already failed too many times
  await pool.query(`UPDATE certificate_jobs SET status = 'failed' WHERE status = 'pending' AND attempts >= 5`);
}

export async function countPendingJobs() {
  const [[{ n }]] = await pool.query(`SELECT COUNT(*) AS n FROM certificate_jobs WHERE status IN ('pending','processing')`);
  return n;
}

export async function getBatchProgress(batchId) {
  const [[gen]] = await pool.query(
    `SELECT
       SUM(type='generate' AND status='done') AS doneCount,
       SUM(type='generate' AND status IN ('pending','processing')) AS procCount,
       SUM(type='generate' AND status='failed') AS failCount,
       SUM(type='generate') AS totalCount
     FROM certificate_jobs WHERE batchId = ?`, [batchId]
  );
  return {
    generated: Number(gen.doneCount) || 0,
    processing: Number(gen.procCount) || 0,
    failed: Number(gen.failCount) || 0,
    total: Number(gen.totalCount) || 0
  };
}

export async function retryFailedBatchJobs(batchId) {
  const [res] = await pool.query(
    `UPDATE certificate_jobs SET status = 'pending', attempts = 0, lastError = NULL, updatedAt = ?
     WHERE batchId = ? AND status = 'failed'`, [now(), batchId]
  );
  return res.affectedRows;
}

// ======================= EMAILS =======================
export async function upsertEmailRecord(certificateId, recipientEmail) {
  const ts = now();
  const id = `CEML-${certificateId}`;
  await pool.query(
    `INSERT INTO certificate_emails (id, certificateId, recipientEmail, status, createdAt, updatedAt)
     VALUES (?,?,?,'PENDING',?,?)
     ON DUPLICATE KEY UPDATE recipientEmail = VALUES(recipientEmail), status = 'PENDING', updatedAt = VALUES(updatedAt)`,
    [id, certificateId, recipientEmail, ts, ts]
  );
}

export async function getEmailRecord(certificateId) {
  const [rows] = await pool.query('SELECT * FROM certificate_emails WHERE certificateId = ? LIMIT 1', [certificateId]);
  return rows[0] || null;
}

export async function markEmailSent(certificateId) {
  await pool.query(
    `UPDATE certificate_emails SET status = 'SENT', sentAt = ?, failureReason = NULL, updatedAt = ? WHERE certificateId = ?`,
    [now(), now(), certificateId]
  );
}

export async function markEmailFailed(certificateId, reason) {
  await pool.query(
    `UPDATE certificate_emails SET status = 'FAILED', failureReason = ?, retryCount = retryCount + 1, updatedAt = ? WHERE certificateId = ?`,
    [String(reason || '').slice(0, 500), now(), certificateId]
  );
}

export async function getFailedEmailCertificateIds(eventId) {
  const [rows] = await pool.query(
    `SELECT e.certificateId FROM certificate_emails e JOIN certificates c ON c.id = e.certificateId
     WHERE c.eventId = ? AND e.status = 'FAILED'`, [eventId]
  );
  return rows.map((r) => r.certificateId);
}

// ======================= AUDIT =======================
export async function logAudit({ actor, action, eventId = null, targetType = null, targetId = null, metadata = null }) {
  const id = await nextId('audit_logs', 'AUD');
  await pool.query(
    `INSERT INTO audit_logs (id, actor, action, eventId, targetType, targetId, metadata, createdAt)
     VALUES (?,?,?,?,?,?,?,?)`,
    [id, actor || 'system', action, eventId, targetType, targetId, metadata ? JSON.stringify(metadata) : null, now()]
  );
}

export async function getAuditLogs(eventId, limit = 50) {
  const [rows] = await pool.query(
    'SELECT * FROM audit_logs WHERE eventId = ? ORDER BY pk DESC LIMIT ?', [eventId, limit]
  );
  return rows.map((r) => ({ ...r, metadata: parseJson(r.metadata), createdAt: toIso(r.createdAt) }));
}
