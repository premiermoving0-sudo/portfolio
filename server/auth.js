import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { db, findUserById, findUserByEmail } from './db.js';
import { JWT_SECRET, IS_PROD } from './config.js';

const COOKIE = 'session';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 12);

async function userFromCookie(req) {
  try {
    if (!JWT_SECRET) return null;
    const payload = jwt.verify(req.cookies?.[COOKIE] || '', JWT_SECRET);
    return await findUserById(payload.sub);
  } catch { return null; }
}

export async function attachUser(req, _res, next) {
  req.user = await userFromCookie(req);
  next();
}

export async function requireAdmin(req, res, next) {
  req.user = req.user || await userFromCookie(req);
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});

export const authRouter = Router();

authRouter.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const user = await findUserByEmail(email);
    const ok = bcrypt.compareSync(password, user ? user.password_hash : DUMMY_HASH);
    if (!user || !ok || !JWT_SECRET) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: IS_PROD, maxAge: MAX_AGE, path: '/' });
    res.json({ id: user.id, email: user.email });
  } catch (e) { next(e); }
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

authRouter.get('/me', attachUser, (req, res) => res.json(req.user));
