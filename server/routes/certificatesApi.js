import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { asyncRouter } from '../lib/asyncRouter.js';
import { rateLimit } from '../lib/rateLimit.js';
import { getDbEventById } from '../db/store.js';
import * as cs from '../db/certificateStore.js';
import { parseSheet, autoDetectMapping } from '../lib/spreadsheet.js';
import { classifyParticipants, countByStatus, revalidateParticipant } from '../lib/participantPipeline.js';
import { deriveEventCode, buildCertificateNumber, generateVerificationToken } from '../lib/certificateId.js';
import { formatEventDateText } from '../lib/certificateDates.js';
import { certificatesDir, kickWorker } from '../lib/certificateWorker.js';

const router = asyncRouter();

const SHEET_SIZE_LIMIT = 5 * 1024 * 1024;
const ALLOWED_EXT = new Set(['.csv', '.xlsx', '.xls']);
const sheetUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: SHEET_SIZE_LIMIT },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!ALLOWED_EXT.has(ext)) return cb(new Error('Only .csv, .xlsx or .xls files are allowed.'));
    cb(null, true);
  }
});

// ---- helpers -------------------------------------------------------------

// Read-only event facts the certificate UI shows (event is the source of truth).
function eventSummary(event) {
  if (!event) return null;
  return {
    id: event.id, title: event.title, date: event.date, endDate: event.endDate || null,
    eventDateText: formatEventDateText(event.date, event.endDate),
    mode: event.mode, venue: event.venue, city: event.city,
    organizer: event.organizer, category: event.category
  };
}

async function loadEventOr404(req, res) {
  const event = await getDbEventById(req.params.eventId);
  if (!event) { res.status(404).json({ error: 'Event not found' }); return null; }
  return event;
}

// Public verification payload — deliberately no email / phone / ids.
async function publicCertShape(certificate) {
  const event = await getDbEventById(certificate.eventId);
  const template = certificate.templateId
    ? await cs.getTemplateById(certificate.templateId)
    : await cs.getActiveTemplate();
  const base = {
    status: certificate.status === 'revoked' ? 'REVOKED' : 'VALID',
    participantName: certificate.participantName,
    eventName: event?.title || '',
    eventDateText: formatEventDateText(event?.date, event?.endDate),
    certificateId: certificate.certificateNumber,
    issuedBy: template?.organizationName || event?.organizer || 'Ellangala’s Academy',
    issuedAt: certificate.issuedAt
  };
  if (certificate.status === 'revoked') base.revocationReason = certificate.revocationReason || null;
  return base;
}

// =======================================================================
// ADMIN — CERTIFICATE SETTINGS
// =======================================================================
router.get('/admin/events/:eventId/certificate-settings', async (req, res) => {
  const event = await loadEventOr404(req, res);
  if (!event) return;
  const config = await cs.getOrCreateCertConfig(event.id);
  const templates = await cs.getTemplates();
  const registrationCount = await cs.countEventRegistrations(event.id, event.title);
  res.json({ event: eventSummary(event), config, templates, registrationCount });
});

router.put('/admin/events/:eventId/certificate-settings', async (req, res) => {
  const event = await loadEventOr404(req, res);
  if (!event) return;
  const allowed = ['templateId', 'certificateEnabled', 'eligibilityMode', 'requireRegistrationMatch',
    'autoSendEmail', 'idFormat', 'orgCode', 'eventCode'];
  const patch = {};
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
  const config = await cs.saveCertConfig(event.id, patch);
  await cs.logAudit({ actor: req.adminEmail, action: 'CertificateSettingsUpdated', eventId: event.id, metadata: patch });
  res.json({ config });
});

// =======================================================================
// ADMIN — TEMPLATES
// =======================================================================
router.get('/admin/certificate-templates', async (req, res) => {
  res.json(await cs.getTemplates());
});

router.post('/admin/certificate-templates', async (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'Template name is required.' });
  const tpl = await cs.saveTemplate(req.body);
  await cs.logAudit({ actor: req.adminEmail, action: 'CertificateTemplateCreated', targetType: 'template', targetId: tpl.id });
  res.status(201).json(tpl);
});

router.put('/admin/certificate-templates/:id', async (req, res) => {
  const existing = await cs.getTemplateById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Template not found' });
  const tpl = await cs.saveTemplate({ ...req.body, id: req.params.id });
  await cs.logAudit({ actor: req.adminEmail, action: 'CertificateTemplateUpdated', targetType: 'template', targetId: tpl.id });
  res.json(tpl);
});

// =======================================================================
// ADMIN — SPREADSHEET IMPORT
// =======================================================================
router.post('/admin/events/:eventId/certificate-imports', (req, res) => {
  sheetUpload.single('file')(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: 'No spreadsheet file provided.' });
      const event = await getDbEventById(req.params.eventId);
      if (!event) return res.status(404).json({ error: 'Event not found' });

      let parsed;
      try {
        parsed = parseSheet(req.file.buffer);
      } catch {
        return res.status(400).json({ error: 'Unable to process spreadsheet. Please export a clean XLSX or CSV.' });
      }
      if (!parsed.headers.length) return res.status(400).json({ error: 'The spreadsheet has no header row.' });
      if (!parsed.rows.length) return res.status(400).json({ error: 'The spreadsheet has no data rows.' });

      const autoMapping = autoDetectMapping(parsed.headers);
      const batch = await cs.createBatch({
        eventId: event.id,
        uploadedBy: req.adminEmail,
        fileName: req.file.originalname,
        headers: parsed.headers,
        columnMapping: autoMapping,
        rawRows: parsed.rows
      });
      await cs.logAudit({
        actor: req.adminEmail, action: 'SpreadsheetUploaded', eventId: event.id,
        targetType: 'batch', targetId: batch.id, metadata: { fileName: req.file.originalname, rows: parsed.rows.length }
      });
      res.status(201).json({
        batch,
        event: eventSummary(event),
        headers: parsed.headers,
        autoMapping,
        sampleRows: parsed.rows.slice(0, 5),
        totalRows: parsed.rows.length
      });
    } catch (e) {
      res.status(500).json({ error: 'Unable to process spreadsheet.' });
    }
  });
});

// Set column mapping -> validate + match + classify. Does NOT generate anything.
router.put('/admin/certificate-imports/:batchId/mapping', async (req, res) => {
  const batch = await cs.getBatch(req.params.batchId, { withRows: true });
  if (!batch) return res.status(404).json({ error: 'Import batch not found' });
  const event = await getDbEventById(batch.eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const mapping = req.body.columnMapping || {};
  const phoneRequired = Boolean(req.body.phoneRequired);
  if (!mapping.name) return res.status(400).json({ error: 'Name column is required.' });
  if (!mapping.email) return res.status(400).json({ error: 'Email column could not be identified. Please map the Email column.' });

  const config = await cs.getOrCreateCertConfig(event.id);
  const registrations = await cs.getEventRegistrations(event.id, event.title);
  const { participants, counts } = classifyParticipants({
    rawRows: batch.rawRows,
    mapping,
    phoneRequired,
    requireRegistrationMatch: config.requireRegistrationMatch,
    registrations,
    existingCertificateEmails: await cs.getActiveCertificateEmails(event.id)
  });

  await cs.replaceParticipants(batch.id, event.id, participants);
  const updated = await cs.updateBatch(batch.id, {
    columnMapping: mapping,
    phoneRequired,
    totalRows: counts.total,
    validRows: counts.READY,
    invalidRows: counts.INVALID,
    duplicateRows: counts.DUPLICATE,
    status: 'reviewed'
  });
  await cs.logAudit({
    actor: req.adminEmail, action: 'ColumnMappingChanged', eventId: event.id,
    targetType: 'batch', targetId: batch.id, metadata: mapping
  });
  res.json({ batch: updated, counts, participants: await cs.getBatchParticipants(batch.id) });
});

router.get('/admin/certificate-imports/:batchId', async (req, res) => {
  const batch = await cs.getBatch(req.params.batchId);
  if (!batch) return res.status(404).json({ error: 'Import batch not found' });
  const event = await getDbEventById(batch.eventId);
  const participants = await cs.getBatchParticipants(batch.id);
  res.json({ batch, event: eventSummary(event), participants, counts: countByStatus(participants) });
});

// Host edits / exclusions — audited.
router.patch('/admin/certificate-participants/:id', async (req, res) => {
  const participant = await cs.getParticipant(req.params.id);
  if (!participant) return res.status(404).json({ error: 'Participant not found' });
  const batch = await cs.getBatch(participant.batchId);
  const patch = {};
  let action = 'ParticipantEdited';

  if (req.body.action === 'exclude') {
    patch.status = 'EXCLUDED';
    patch.eligible = false;
    action = 'ParticipantExcluded';
  } else if (req.body.action === 'approve') {
    patch.status = 'READY';
    patch.eligible = true;
    action = 'ParticipantManuallyApproved';
  } else {
    const next = revalidateParticipant({
      name: req.body.name ?? participant.name,
      email: req.body.email ?? participant.email,
      phone: req.body.phone ?? participant.phone
    }, { phoneRequired: batch?.phoneRequired });
    patch.name = next.name;
    patch.email = next.email;
    patch.phone = next.phone;
    patch.validationErrors = next.validationErrors;
    if (next.validationErrors.length) { patch.status = 'INVALID'; patch.eligible = false; }
    else if (participant.status === 'INVALID') { patch.status = 'READY'; patch.eligible = true; }
  }

  const updated = await cs.updateParticipant(participant.id, patch);
  await cs.logAudit({
    actor: req.adminEmail, action, eventId: participant.eventId,
    targetType: 'participant', targetId: participant.id,
    metadata: { before: { name: participant.name, email: participant.email, phone: participant.phone, status: participant.status }, after: patch }
  });
  res.json(updated);
});

// =======================================================================
// ADMIN — BULK GENERATION (host-confirmed)
// =======================================================================
router.post('/admin/certificate-imports/:batchId/generate', async (req, res) => {
  const batch = await cs.getBatch(req.params.batchId);
  if (!batch) return res.status(404).json({ error: 'Import batch not found' });
  const event = await getDbEventById(batch.eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  const config = await cs.getOrCreateCertConfig(event.id);
  if (!config.certificateEnabled) {
    return res.status(400).json({ error: 'Enable certificates for this event before generating.' });
  }

  const participants = await cs.getBatchParticipants(batch.id);
  const eligible = participants.filter((p) => p.eligible && p.status === 'READY');
  if (!eligible.length) return res.status(400).json({ error: 'No eligible participants to generate.' });

  const template = config.templateId ? await cs.getTemplateById(config.templateId) : await cs.getActiveTemplate();
  const eventCode = config.eventCode || deriveEventCode(event);
  const year = new Date(event.date || Date.now()).getFullYear();
  let seq = await cs.countCertificates(event.id);

  let created = 0;
  let alreadyCertified = 0;

  for (const p of eligible) {
    const prior = await cs.getCertificateByParticipant(event.id, p.email);
    if (prior) {
      alreadyCertified++;
      await cs.updateParticipant(p.id, { status: 'ALREADY_CERTIFIED', eligible: false, certificateId: prior.id });
      continue;
    }
    seq++;
    const certificateNumber = buildCertificateNumber({
      format: config.idFormat, org: config.orgCode || 'ELA', eventCode, year, sequence: seq
    });
    const { created: didCreate, certificate } = await cs.insertCertificate({
      certificateNumber,
      verificationToken: generateVerificationToken(),
      eventId: event.id,
      registrationId: p.registrationId,
      batchId: batch.id,
      participantName: p.name,
      participantEmail: p.email,
      participantPhone: p.phone,
      templateId: template ? template.id : null
    });
    if (!certificate) continue; // rare id/number collision — skip, host can retry
    if (didCreate) {
      created++;
      await cs.enqueueJob({ type: 'generate', certificateId: certificate.id, batchId: batch.id });
      await cs.updateParticipant(p.id, { certificateId: certificate.id, status: 'READY' });
    } else {
      alreadyCertified++;
      await cs.updateParticipant(p.id, { certificateId: certificate.id, status: 'ALREADY_CERTIFIED', eligible: false });
    }
  }

  await cs.updateBatch(batch.id, { status: 'generating' });
  await cs.logAudit({
    actor: req.adminEmail, action: 'CertificatesGenerated', eventId: event.id,
    targetType: 'batch', targetId: batch.id, metadata: { created, alreadyCertified }
  });
  kickWorker();
  res.status(202).json({ batchId: batch.id, created, alreadyCertified, queued: created });
});

router.get('/admin/certificate-batches/:batchId/progress', async (req, res) => {
  const batch = await cs.getBatch(req.params.batchId);
  if (!batch) return res.status(404).json({ error: 'Import batch not found' });
  const progress = await cs.getBatchProgress(batch.id);
  res.json({ batch, progress });
});

router.post('/admin/certificate-batches/:batchId/retry', async (req, res) => {
  const batch = await cs.getBatch(req.params.batchId);
  if (!batch) return res.status(404).json({ error: 'Import batch not found' });
  const requeued = await cs.retryFailedBatchJobs(batch.id);
  await cs.logAudit({ actor: req.adminEmail, action: 'BatchJobsRetried', eventId: batch.eventId, targetType: 'batch', targetId: batch.id, metadata: { requeued } });
  kickWorker();
  res.json({ requeued });
});

// =======================================================================
// ADMIN — CERTIFICATE MANAGEMENT
// =======================================================================
router.get('/admin/events/:eventId/certificates', async (req, res) => {
  const event = await loadEventOr404(req, res);
  if (!event) return;
  const certificates = await cs.listCertificates(event.id, { search: req.query.search || '', filter: req.query.filter || 'all' });
  const stats = await cs.getEventCertStats(event.id);
  const config = await cs.getOrCreateCertConfig(event.id);
  const registrationCount = await cs.countEventRegistrations(event.id, event.title);
  const batches = await cs.listBatches(event.id);
  const attendanceUploaded = batches.reduce((s, b) => s + (b.totalRows || 0), 0);
  res.json({
    event: eventSummary(event),
    config,
    certificates,
    batches,
    stats: { ...stats, registered: registrationCount, attendanceUploaded },
    audit: await cs.getAuditLogs(event.id, 30)
  });
});

router.get('/admin/certificates/:id', async (req, res) => {
  const certificate = await cs.getCertificateById(req.params.id);
  if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
  const email = await cs.getEmailRecord(certificate.id);
  res.json({ certificate, email });
});

router.get('/admin/certificates/:id/download', async (req, res) => {
  const certificate = await cs.getCertificateById(req.params.id);
  if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
  const file = path.join(certificatesDir, `${certificate.id}.pdf`);
  if (!fs.existsSync(file)) return res.status(409).json({ error: 'Certificate PDF is still being generated.' });
  await cs.logAudit({ actor: req.adminEmail, action: 'CertificateDownloaded', eventId: certificate.eventId, targetType: 'certificate', targetId: certificate.id });
  res.setHeader('Content-Disposition', `attachment; filename="${certificate.certificateNumber}.pdf"`);
  res.setHeader('Content-Type', 'application/pdf');
  fs.createReadStream(file).pipe(res);
});

router.post('/admin/certificates/:id/resend', async (req, res) => {
  const certificate = await cs.getCertificateById(req.params.id);
  if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
  if (certificate.status === 'revoked') return res.status(400).json({ error: 'Cannot email a revoked certificate.' });
  await cs.upsertEmailRecord(certificate.id, certificate.participantEmail);
  await cs.enqueueJob({ type: 'email', certificateId: certificate.id, force: true });
  await cs.logAudit({ actor: req.adminEmail, action: 'EmailResent', eventId: certificate.eventId, targetType: 'certificate', targetId: certificate.id });
  kickWorker();
  res.json({ ok: true });
});

router.post('/admin/certificates/:id/revoke', async (req, res) => {
  const reason = String(req.body.reason || '').trim();
  if (!reason) return res.status(400).json({ error: 'A revocation reason is required.' });
  const certificate = await cs.getCertificateById(req.params.id);
  if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
  const updated = await cs.revokeCertificate(certificate.id, reason);
  await cs.logAudit({
    actor: req.adminEmail, action: 'CertificateRevoked', eventId: certificate.eventId,
    targetType: 'certificate', targetId: certificate.id, metadata: { reason }
  });
  res.json({ certificate: updated });
});

router.post('/admin/events/:eventId/certificate-emails/retry', async (req, res) => {
  const event = await loadEventOr404(req, res);
  if (!event) return;
  const ids = await cs.getFailedEmailCertificateIds(event.id);
  for (const certId of ids) {
    await cs.upsertEmailRecord(certId, (await cs.getCertificateById(certId))?.participantEmail);
    await cs.enqueueJob({ type: 'email', certificateId: certId, force: true });
  }
  await cs.logAudit({ actor: req.adminEmail, action: 'FailedEmailsRetried', eventId: event.id, metadata: { count: ids.length } });
  kickWorker();
  res.json({ requeued: ids.length });
});

// =======================================================================
// PUBLIC — VERIFICATION (rate limited, no PII)
// =======================================================================
const verifyLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 40 });

router.get('/certificates/verify/:token', verifyLimiter, async (req, res) => {
  const certificate = await cs.getCertificateByToken(req.params.token);
  if (!certificate) return res.status(404).json({ status: 'NOT_FOUND' });
  res.json(await publicCertShape(certificate));
});

router.get('/certificates/lookup/:number', verifyLimiter, async (req, res) => {
  const certificate = await cs.getCertificateByNumber(String(req.params.number).trim());
  if (!certificate) return res.status(404).json({ status: 'NOT_FOUND' });
  res.json(await publicCertShape(certificate));
});

// Inline PDF for the participant — the unguessable token is the authorization.
router.get('/certificates/file/:token', verifyLimiter, async (req, res) => {
  const certificate = await cs.getCertificateByToken(req.params.token);
  if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
  if (certificate.status === 'revoked') return res.status(410).json({ error: 'This certificate has been revoked.' });
  const file = path.join(certificatesDir, `${certificate.id}.pdf`);
  if (!fs.existsSync(file)) return res.status(409).json({ error: 'Certificate PDF is still being generated.' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${certificate.certificateNumber}.pdf"`);
  fs.createReadStream(file).pipe(res);
});

export default router;
