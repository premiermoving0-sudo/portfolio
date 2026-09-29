import 'dotenv/config';

export const IS_PROD = process.env.NODE_ENV === 'production';
export const PORT = Number(process.env.PORT) || 3000;

export const JWT_SECRET = process.env.JWT_SECRET || '';
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'portfolio-uploads';

export const SMTP = {
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT) || 587,
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  notifyTo: process.env.NOTIFY_EMAIL || '',
};

if (IS_PROD && (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)) {
  console.warn('[config] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured. Database/storage calls will fail.');
}
if (IS_PROD && (!JWT_SECRET || JWT_SECRET.length < 32)) {
  console.warn('[config] JWT_SECRET should be a random string of at least 32 characters.');
}
