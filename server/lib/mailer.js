import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: Number(process.env.SMTP_PORT || 25),
  secure: false,
  ignoreTLS: true
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
