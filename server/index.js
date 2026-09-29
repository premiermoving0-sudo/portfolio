import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { PORT, ROOT, IS_PROD, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET } from './config.js';
import { ensureAdmin } from './db.js';
import { authRouter } from './auth.js';
import { api } from './routes.js';

async function ensureStorageBucket() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, { method: 'POST', headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, apikey: SUPABASE_SERVICE_ROLE_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: SUPABASE_BUCKET, name: SUPABASE_BUCKET, public: true, file_size_limit: 10485760 }) });
    if (!res.ok && res.status !== 409) console.warn('[storage] Bucket setup:', await res.text());
  } catch (e) { console.warn('[storage] Bucket check failed:', e.message); }
}

await ensureAdmin();
await ensureStorageBucket();

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: { useDefaults: false, directives: { 'default-src': ["'self'"], 'script-src': ["'self'"], 'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], 'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'], 'img-src': ["'self'", 'data:', 'https:'], 'connect-src': ["'self'", 'https:'], 'object-src': ["'none'"], 'base-uri': ["'self'"], 'frame-ancestors': ["'none'"], 'form-action': ["'self'"] } }, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));
app.use('/api/auth', authRouter);
app.use('/api', api);

const DIST = path.join(ROOT, 'dist');
if (fs.existsSync(DIST)) {
  app.use('/assets', express.static(path.join(DIST, 'assets'), { maxAge: '1y', immutable: true }));
  app.use(express.static(DIST, { maxAge: '1h', index: false }));
  app.use((req, res, next) => { if (req.method !== 'GET' && req.method !== 'HEAD') return next(); res.sendFile(path.join(DIST, 'index.html')); });
} else if (IS_PROD) console.warn('[server] dist/ not found — run "npm run build" first.');

app.listen(PORT, () => console.log(`[server] listening on :${PORT} (${IS_PROD ? 'production' : 'development'})`));
