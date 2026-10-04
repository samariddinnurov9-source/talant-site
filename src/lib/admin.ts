// Server-only Firebase Admin helpers. Used by API routes and by public pages that read site content.
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export class HttpError extends Error { constructor(public status: number, msg = '') { super(msg); } }

function app() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set');
  return initializeApp({ credential: cert(JSON.parse(raw)) });
}
export const adminAuth = () => getAuth(app());
export const adminDb = () => getFirestore(app());

/** Verifies the Firebase ID token (including revocation) and requires the admin role claim. */
export async function requireAdmin(req: Request) {
  const h = req.headers.get('authorization') ?? '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) throw new HttpError(401);
  let d;
  try { d = await adminAuth().verifyIdToken(token, true); } catch { throw new HttpError(401); }
  if (d.role !== 'admin') throw new HttpError(403);
  return d;
}

export function toEmail(login: string) {
  const l = login.trim().toLowerCase();
  return l.includes('@') ? l : `${l.replace(/[^a-z0-9._-]/g, '')}@talant.app`;
}
