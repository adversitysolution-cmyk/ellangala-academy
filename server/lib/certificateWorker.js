import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDbEventById } from '../db/store.js';
import * as cs from '../db/certificateStore.js';
import { buildCertificateVars } from './certificateTemplate.js';
import { renderCertificatePdf } from './certificatePdf.js';
import { buildCertificateEmail } from './certificateEmail.js';
import { sendMail } from './mailer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const certificatesDir = path.join(__dirname, '..', 'uploads', 'certificates');
if (!fs.existsSync(certificatesDir)) fs.mkdirSync(certificatesDir, { recursive: true });

const uploadsDir = path.join(__dirname, '..', 'uploads');
const BASE_URL = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '');
const CONCURRENCY = 3;

export const verifyUrlFor = (token) => `${BASE_URL}/verify/c/${token}`;

// Maps a stored "/uploads/x.png" URL to an absolute path the PDF layer can read.
function assetPath(url) {
  if (!url) return null;
  if (url.startsWith('/uploads/')) return path.join(uploadsDir, url.slice('/uploads/'.length));
  if (path.isAbsolute(url) && fs.existsSync(url)) return url;
  return null;
}

async function processGenerateJob(job) {
  const certificate = await cs.getCertificateById(job.certificateId);
  if (!certificate) return; // certificate deleted — nothing to do
  const pdfFile = path.join(certificatesDir, `${certificate.id}.pdf`);
  const alreadyRendered = !job.force && certificate.pdfPath && fs.existsSync(pdfFile);

  if (!alreadyRendered) {
    await renderAndStore(certificate, pdfFile);
  }
  // Always make sure delivery is arranged (a prior run may have died after
  // rendering but before queuing the email).
  const config = await cs.getCertConfig(certificate.eventId);
  if (config?.autoSendEmail) {
    const email = await cs.getEmailRecord(certificate.id);
    if (email?.status !== 'SENT' && !(await cs.hasOpenJob('email', certificate.id))) {
      await cs.enqueueJob({ type: 'email', certificateId: certificate.id, batchId: job.batchId });
    }
  }
}

async function renderAndStore(certificate, pdfFile) {
  const event = await getDbEventById(certificate.eventId);
  const template = certificate.templateId
    ? await cs.getTemplateById(certificate.templateId)
    : await cs.getActiveTemplate();
  const tpl = template || { organizationName: event?.organizer || 'Ellangala’s Academy' };

  const vars = buildCertificateVars({
    certificate, event, template: tpl, verificationUrl: verifyUrlFor(certificate.verificationToken)
  });
  const pdf = await renderCertificatePdf({
    template: tpl,
    vars,
    assets: {
      logoPath: assetPath(tpl.logoUrl),
      signaturePath: assetPath(tpl.signatureUrl),
      sealPath: assetPath(tpl.sealUrl),
      backgroundPath: assetPath(tpl.backgroundUrl)
    }
  });
  fs.writeFileSync(pdfFile, pdf);
  await cs.setCertificatePdf(certificate.id, `/certificates/${certificate.id}.pdf`);
  // Create the PENDING delivery record now; the caller queues the email job.
  const email = await cs.getEmailRecord(certificate.id);
  if (!email) await cs.upsertEmailRecord(certificate.id, certificate.participantEmail);
}

async function processEmailJob(job) {
  const certificate = await cs.getCertificateById(job.certificateId);
  if (!certificate || certificate.status === 'revoked') return;
  const record = await cs.getEmailRecord(certificate.id);
  if (record?.status === 'SENT' && !job.force) return; // idempotent

  const event = await getDbEventById(certificate.eventId);
  const template = certificate.templateId ? await cs.getTemplateById(certificate.templateId) : await cs.getActiveTemplate();
  try {
    const ok = await sendMail(buildCertificateEmail({
      certificate,
      event,
      viewUrl: verifyUrlFor(certificate.verificationToken),
      organizationName: template?.organizationName
    }));
    if (!ok) throw new Error('SMTP delivery failed');
    await cs.markEmailSent(certificate.id);
  } catch (err) {
    await cs.markEmailFailed(certificate.id, err.message);
    throw err;
  }
}

async function runJob(job) {
  try {
    if (job.type === 'generate') await processGenerateJob(job);
    else if (job.type === 'email') await processEmailJob(job);
    await cs.completeJob(job.id);
  } catch (err) {
    console.error(`certificate job ${job.id} (${job.type}) failed:`, err.message);
    await cs.failJob(job.id, err.message, { retry: job.attempts < 4 });
  }
}

let draining = false;

// Drains the job queue in the current process. Safe to call repeatedly;
// a single loop runs at a time.
// ponytail: in-process worker — fine for one server process. Move to a real
// queue (BullMQ/redis) only if the site ever runs multiple instances.
export async function drainJobs() {
  if (draining) return;
  draining = true;
  try {
    for (;;) {
      const jobs = await cs.claimPendingJobs(CONCURRENCY);
      if (!jobs.length) break;
      await Promise.all(jobs.map(runJob));
    }
  } catch (err) {
    console.error('certificate worker drain error:', err.message);
  } finally {
    draining = false;
  }
}

// Called right after enqueueing so bulk operations start immediately.
export function kickWorker() {
  setImmediate(() => { drainJobs().catch(() => {}); });
}

// Called once on server boot.
export async function startCertificateWorker() {
  await cs.resetStuckJobs();
  kickWorker();
  // safety net: pick up anything missed (e.g. a job re-queued after a failure)
  setInterval(() => { drainJobs().catch(() => {}); }, 30_000).unref();
}
