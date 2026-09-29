import bcrypt from 'bcryptjs';
import { ADMIN_EMAIL, ADMIN_PASSWORD, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config.js';

const headers = () => ({
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
});

function ensureConfigured() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const err = new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    err.status = 500;
    throw err;
  }
}

async function request(table, { method = 'GET', params = {}, body, prefer = 'return=representation' } = {}) {
  ensureConfigured();
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const h = headers();
  if (prefer) h.Prefer = prefer;
  const res = await fetch(url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || text || `Supabase request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const db = {
  async all(table, params = {}) { return (await request(table, { params })) || []; },
  async get(table, params = {}) { return (await request(table, { params, prefer: 'return=representation' }))?.[0] || null; },
  async insert(table, row) { return (await request(table, { method: 'POST', body: row }))?.[0] || null; },
  async update(table, id, row) {
    return (await request(table, { method: 'PATCH', params: { id: `eq.${id}` }, body: row }))?.[0] || null;
  },
  async delete(table, id) { return request(table, { method: 'DELETE', params: { id: `eq.${id}` }, prefer: 'return=representation' }); },
  async count(table) {
    ensureConfigured();
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
    url.searchParams.set('select', 'id');
    url.searchParams.set('limit', '1');
    const res = await fetch(url, { headers: { ...headers(), Prefer: 'count=exact' } });
    if (!res.ok) throw new Error(await res.text());
    const range = res.headers.get('content-range');
    return Number(range?.split('/')[1] || 0);
  },
};

export async function ensureAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('[auth] ADMIN_EMAIL / ADMIN_PASSWORD not configured.');
    return;
  }
  const row = await db.get('users', { email: `eq.${ADMIN_EMAIL}`, select: '*' });
  const hash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
  if (!row) {
    await db.insert('users', { email: ADMIN_EMAIL, password_hash: hash });
    console.log(`[auth] Admin created: ${ADMIN_EMAIL}`);
  } else if (!bcrypt.compareSync(ADMIN_PASSWORD, row.password_hash)) {
    await db.update('users', row.id, { password_hash: hash });
    console.log(`[auth] Admin password updated: ${ADMIN_EMAIL}`);
  }
}

export async function findUserById(id) {
  return db.get('users', { id: `eq.${id}`, select: 'id,email' });
}

export async function findUserByEmail(email) {
  return db.get('users', { email: `eq.${email}`, select: '*' });
}
