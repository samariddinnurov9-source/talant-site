import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb } from '@/lib/admin';
import { nameKey, normName } from '@/lib/names';
import { ipOf, limited } from '@/lib/ratelimit';

export const runtime = 'nodejs';
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');

// Public student registration. The role is always "student" and the account stays unapproved until the admin confirms it.
export async function POST(req: Request) {
  if (limited(`reg:${ipOf(req)}`, 3, 60 * 60 * 1000)) return NextResponse.json({ error: 'rate' }, { status: 429 });
  if (Number(req.headers.get('content-length') ?? 0) > 3000) return NextResponse.json({ error: 'size' }, { status: 413 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'json' }, { status: 400 }); }
  if (clean(b.website, 50) !== '' || Number(b.elapsed) < 3000) return NextResponse.json({ ok: true }); // bot traps
  const first = clean(b.first, 40), last = clean(b.last, 40), email = clean(b.email, 100).toLowerCase(), password = typeof b.password === 'string' ? b.password.slice(0, 100) : '';
  const nameOk = (s: string) => s.length >= 2 && /^[\p{L}][\p{L}\s'’-]*$/u.test(s);
  if (!nameOk(first) || !nameOk(last) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || password.length < 8)
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const name = normName(`${first} ${last}`);
  try {
    const user = await adminAuth().createUser({ email, password, displayName: name });
    await adminAuth().setCustomUserClaims(user.uid, { role: 'student' });
    await adminDb().doc(`users/${user.uid}`).set({ name, nameKey: nameKey(name), login: email, email, role: 'student', blocked: false, approved: false, createdAt: FieldValue.serverTimestamp() });
  } catch (e) {
    if ((e as { code?: string }).code === 'auth/email-already-exists') return NextResponse.json({ ok: true }); // do not reveal which emails exist
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
