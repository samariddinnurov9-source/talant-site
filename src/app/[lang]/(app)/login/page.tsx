'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { signIn, useAuth } from '@/lib/auth';
import { firebaseConfigured } from '@/lib/firebase';
import { getX } from '@/lib/x';

export default function Login() {
  const { lang } = useParams<{ lang: string }>();
  const x = getX(lang), l = x.login;
  const router = useRouter();
  const { role, user } = useAuth();
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const fails = useRef(0);
  useEffect(() => { if (user && role) router.replace(`/${lang}/${role === 'student' ? 'campus' : 'admin'}`); }, [user, role, lang, router]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fails.current >= 5) { setErr(l.error); return; } // small client-side brake; Firebase also throttles server-side
    const f = new FormData(e.currentTarget); setBusy(true); setErr('');
    try { await signIn(String(f.get('login')), String(f.get('password'))); }
    catch { fails.current += 1; setErr(l.error); setBusy(false); }
  }
  return (
    <div className="login">
      <form onSubmit={submit} className="login-card">
        <Link href={`/${lang}`} className="brand"><Image src="/logo.png" alt="" width={48} height={48} /><span>TALANT</span></Link>
        <h1>{l.title}</h1>
        {!firebaseConfigured && <p className="form-msg err">{l.notConf}</p>}
        <label>{l.login}<input name="login" required autoComplete="username" maxLength={100} /></label>
        <label>{l.password}<input name="password" type="password" required autoComplete="current-password" maxLength={100} /></label>
        <button className="btn btn-amber" disabled={busy || !firebaseConfigured}>{l.submit}</button>
        <p role="alert" className="form-msg err">{err}</p>
        <Link className="alt-link" href={`/${lang}/register`}>{l.noAcc}</Link>
      </form>
    </div>
  );
}
