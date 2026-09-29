import { Router } from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { db } from './db.js';
import { requireAdmin, attachUser } from './auth.js';
import { ENTITIES, MAX_TEXT } from './entities.js';
import { SMTP, SUPABASE_BUCKET, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from './config.js';
import { sendMail } from './mailer.js';

export const api = Router();
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const SLOTS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
const guard = (access) => (access === 'admin' ? requireAdmin : (_req, _res, next) => next());
const publicWriteLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 15, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests. Please try again later.' } });

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

function pick(def, body, { partial }) {
  const out = {};
  for (const [name, type] of Object.entries(def.fields)) {
    if (!(name in (body || {}))) continue;
    let v = body[name];
    if (type === 'number') { v = Number(v); if (!Number.isFinite(v)) throw new HttpError(400, `${name} must be a number`); }
    else { v = v == null ? '' : String(v).trim(); if (v.length > MAX_TEXT) throw new HttpError(400, `${name} is too long`); }
    out[name] = v;
  }
  for (const r of def.required) { if (partial && !(r in out)) continue; if (out[r] === undefined || out[r] === '') throw new HttpError(400, `${r} is required`); }
  return out;
}

async function ownerEmail() {
  if (SMTP.notifyTo) return SMTP.notifyTo;
  const row = await db.get('site_settings', { order: 'updated_date.desc', limit: '1', select: 'email' });
  return row?.email || SMTP.user;
}

api.get('/bookings/taken', async (_req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    res.json(await db.all('bookings', { date: `gte.${today}`, select: 'date,time', order: 'date.asc,time.asc', limit: '1000' }));
  } catch (e) { next(e); }
});

const hooks = {
  bookings: {
    beforeCreate(data, req) {
      if (!req.user) {
        if (!EMAIL_RE.test(data.client_email)) throw new HttpError(400, 'Invalid email address');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new HttpError(400, 'Invalid date');
        if (!SLOTS.includes(data.time)) throw new HttpError(400, 'Invalid time slot');
        const d = new Date(`${data.date}T12:00:00Z`);
        const days = (d - Date.now()) / 86400000;
        if (Number.isNaN(d.getTime()) || days < -1 || days > 90) throw new HttpError(400, 'Date out of range');
        if ([0, 6].includes(d.getUTCDay())) throw new HttpError(400, 'Weekdays only');
      }
      data.status = 'pending';
    },
    async afterCreate(row) {
      const when = `${row.date} at ${row.time} (USA Eastern)`;
      const to = await ownerEmail();
      sendMail({ to, replyTo: row.client_email, subject: `New booking: ${row.client_name} — ${row.date} ${row.time}`, text: `New meeting request\n\nName: ${row.client_name}\nEmail: ${row.client_email}\nService: ${row.service || '—'}\nWhen: ${when}\nMessage: ${row.message || '—'}` });
      sendMail({ to: row.client_email, subject: 'Your meeting request', text: `Hi ${row.client_name.split(' ')[0]},\n\nThanks for reaching out! I've received your request for ${when}. I'll confirm shortly.` });
    },
    beforeUpdate(data) { if (data.status && !['pending','confirmed'].includes(data.status)) throw new HttpError(400, 'Invalid status'); },
    afterUpdate(row, before) { if (row.status === 'confirmed' && before.status !== 'confirmed') sendMail({ to: row.client_email, subject: 'Your meeting is confirmed', text: `Hi ${row.client_name.split(' ')[0]},\n\nYour meeting on ${row.date} at ${row.time} (USA Eastern) is confirmed. Talk soon!` }); },
  },
  messages: {
    beforeCreate(data) { if (!EMAIL_RE.test(data.email)) throw new HttpError(400, 'Invalid email address'); },
    async afterCreate(row) { sendMail({ to: await ownerEmail(), replyTo: row.email, subject: `Website enquiry — ${row.name}`, text: `Name: ${row.name}\nEmail: ${row.email}\nMode: ${row.mode || '—'}\nService: ${row.service || '—'}\n\n${row.message}` }); },
  },
};

for (const [route, def] of Object.entries(ENTITIES)) {
  const { table, access } = def;
  const h = hooks[route] || {};
  const sortable = new Set(['id','created_date','updated_date',...Object.keys(def.fields)]);

  api.get(`/${route}`, guard(access.list), async (req, res, next) => {
    try {
      let sort = String(req.query.sort || '-created_date');
      const desc = sort.startsWith('-'); sort = sort.replace(/^-/, '');
      if (!sortable.has(sort)) sort = 'created_date';
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
      res.json(await db.all(table, { select: '*', order: `${sort}.${desc ? 'desc' : 'asc'}`, limit: String(limit) }));
    } catch (e) { next(e); }
  });

  const createChain = access.create === 'public' ? [publicWriteLimiter, attachUser] : [];
  api.post(`/${route}`, ...createChain, guard(access.create), async (req, res, next) => {
    try {
      const data = { ...def.defaults, ...pick(def, req.body, { partial: false }) };
      await h.beforeCreate?.(data, req);
      let row;
      try { row = await db.insert(table, data); }
      catch (e) { if (/duplicate|unique/i.test(String(e.message))) throw new HttpError(409, 'That slot is already taken'); throw e; }
      await h.afterCreate?.(row, null);
      res.status(201).json(row);
    } catch (e) { next(e); }
  });

  api.put(`/${route}/:id`, guard(access.update), async (req, res, next) => {
    try {
      const before = await db.get(table, { id: `eq.${req.params.id}`, select: '*' });
      if (!before) throw new HttpError(404, 'Not found');
      const data = pick(def, req.body, { partial: true });
      data.updated_date = new Date().toISOString();
      await h.beforeUpdate?.(data, req);
      if (!Object.keys(data).length) return res.json(before);
      const row = await db.update(table, req.params.id, data);
      await h.afterUpdate?.(row, before);
      res.json(row);
    } catch (e) { next(e); }
  });

  api.delete(`/${route}/:id`, guard(access.delete), async (req, res, next) => {
    try {
      const rows = await db.delete(table, req.params.id);
      if (!rows?.length) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true });
    } catch (e) { next(e); }
  });
}

const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif', 'application/pdf': '.pdf' };
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, cb) => ALLOWED[file.mimetype] ? cb(null, true) : cb(new HttpError(400, 'Only JPG, PNG, WebP, GIF, AVIF or PDF files are allowed')) });

api.post('/upload', requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new HttpError(500, 'Supabase storage is not configured');
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ALLOWED[req.file.mimetype]}`;
    const path = `uploads/${filename}`;
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(SUPABASE_BUCKET)}/${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, apikey: SUPABASE_SERVICE_ROLE_KEY, 'Content-Type': req.file.mimetype, 'x-upsert': 'false', 'cache-control': '31536000' },
      body: req.file.buffer,
    });
    if (!response.ok) throw new HttpError(502, `Storage upload failed: ${await response.text()}`);
    const file_url = `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(SUPABASE_BUCKET)}/${path}`;
    res.status(201).json({ file_url });
  } catch (e) { next(e); }
});

api.get('/health', (_req, res) => res.json({ ok: true, database: 'supabase', storage: 'supabase' }));
api.use((_req, res) => res.status(404).json({ error: 'Not found' }));
api.use((err, _req, res, _next) => { if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message }); if (err.status && err.status < 500) return res.status(err.status).json({ error: err.message }); console.error(err); res.status(500).json({ error: 'Server error' }); });
