import nodemailer from 'nodemailer';
import { SMTP } from './config.js';

const enabled = !!(SMTP.host && SMTP.user && SMTP.pass);
const transporter = enabled
  ? nodemailer.createTransport({ host: SMTP.host, port: SMTP.port, secure: SMTP.port === 465, auth: { user: SMTP.user, pass: SMTP.pass } })
  : null;

if (!enabled) console.log('[mail] SMTP not configured — emails are skipped (data is still saved in the admin panel).');

const clean = (s) => String(s).replace(/[\r\n]+/g, ' ').slice(0, 200);

/** Fire-and-forget. Never throws, never blocks the HTTP response. */
export function sendMail({ to, subject, text, replyTo }) {
  if (!enabled || !to) return;
  transporter.sendMail({ from: SMTP.from, to, subject: clean(subject), text, replyTo })
    .catch((err) => console.error('[mail] failed:', err.message));
}
