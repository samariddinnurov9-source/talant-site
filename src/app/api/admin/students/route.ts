import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb, HttpError, requireAdmin, toEmail } from '@/lib/admin';
import { nameKey, normName } from '@/lib/names';
import { ipOf, limited } from '@/lib/ratelimit';

export const runtime = 'nodejs';
const s = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const ROLES = ['admin', 'teacher', 'student'];

async function guard(req: Request) {
  if (limited(`adm:${ipOf(req)}`, 60, 60 * 1000)) throw new HttpError(429);
  return requireAdmin(req);
}
const fail = (e: unknown) => {
  if (e instanceof HttpError) return NextResponse.json({ error: e.status }, { status: e.status });
  const code = (e as { code?: string }).code ?? '';
  return NextResponse.json({ error: code || 'server' }, { status: code.startsWith('auth/') ? 400 : 500 });
};

// Create an account (student by default; the owner can create teachers and admins).
export async function POST(req: Request) {
  try {
    await guard(req);
    const b = await req.json();
    const name = normName(s(b.name, 80)), login = s(b.login, 80), password = s(b.password, 100), phone = s(b.phone, 24), grade = s(b.grade, 10);
    const role = ROLES.includes(b.role) ? b.role : 'student';
    if (name.length < 2 || login.length < 3 || password.length < 8) throw new HttpError(400);
    const email = toEmail(login);
    const user = await adminAuth().createUser({ email, password, displayName: name });
    await adminAuth().setCustomUserClaims(user.uid, { role });
    await adminDb().doc(`users/${user.uid}`).set({ name, nameKey: nameKey(name), login, email, phone, grade, role, blocked: false, approved: true, createdAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true, uid: user.uid });
  } catch (e) { return fail(e); }
}

// Actions on an existing account: block, approve, role, password, update (name/email/phone/grade).
export async function PATCH(req: Request) {
  try {
    const me = await guard(req);
    const b = await req.json();
    const uid = s(b.uid, 128); if (!uid) throw new HttpError(400);
    const action = s(b.action, 12) || 'block';
    const ref = adminDb().doc(`users/${uid}`);
    if (action === 'block') {
      if (uid === me.uid) throw new HttpError(400);
      const blocked = b.blocked === true;
      await adminAuth().updateUser(uid, { disabled: blocked });
      if (blocked) await adminAuth().revokeRefreshTokens(uid);
      await ref.update({ blocked });
    } else if (action === 'approve') {
      await ref.update({ approved: b.approved !== false });
    } else if (action === 'role') {
      if (uid === me.uid || !ROLES.includes(b.role)) throw new HttpError(400);
      await adminAuth().setCustomUserClaims(uid, { role: b.role });
      await adminAuth().revokeRefreshTokens(uid);
      await ref.update({ role: b.role });
    } else if (action === 'password') {
      const password = s(b.password, 100); if (password.length < 8) throw new HttpError(400);
      await adminAuth().updateUser(uid, { password }); await adminAuth().revokeRefreshTokens(uid);
    } else if (action === 'update') {
      const name = normName(s(b.name, 80)), email = s(b.email, 100).toLowerCase();
      if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new HttpError(400);
      await adminAuth().updateUser(uid, { displayName: name, email });
      await ref.update({ name, nameKey: nameKey(name), email, login: email, phone: s(b.phone, 24), grade: s(b.grade, 10) });
    } else throw new HttpError(400);
    return NextResponse.json({ ok: true });
  } catch (e) { return fail(e); }
}

// Delete the account together with the student's results.
export async function DELETE(req: Request) {
  try {
    const me = await guard(req);
    const uid = s(new URL(req.url).searchParams.get('uid'), 128);
    if (!uid || uid === me.uid) throw new HttpError(400);
    const db = adminDb();
    const q = await db.collection('results').where('uid', '==', uid).get();
    const batch = db.batch(); q.docs.forEach((d) => batch.delete(d.ref)); await batch.commit();
    await db.doc(`users/${uid}`).delete();
    await adminAuth().deleteUser(uid).catch(() => undefined);
    return NextResponse.json({ ok: true });
  } catch (e) { return fail(e); }
}
