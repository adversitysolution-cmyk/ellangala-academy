import nodemailer from 'nodemailer';

// Defaults to the local Postfix relay (no auth needed). Once real SMTP
// credentials (e.g. Zoho) are available, set SMTP_HOST/SMTP_PORT/SMTP_USER/
// SMTP_PASS in .env — no code changes needed.
const port = Number(process.env.SMTP_PORT || 25);
const hasAuth = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port,
  secure: port === 465,
  ignoreTLS: !hasAuth,
  auth: hasAuth ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
});

const MAIL_FROM = process.env.MAIL_FROM || '"Ellangala’s Academy" <orders@ellangala.com>';

export async function sendMail({ to, subject, text, html }) {
  if (!to) return;
  try {
    await transporter.sendMail({ from: MAIL_FROM, to, subject, text, html });
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
  }
}
