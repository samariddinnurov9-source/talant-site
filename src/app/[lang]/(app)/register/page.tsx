'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { getX } from '@/lib/x';

export default function Register() {
  const { lang } = useParams<{ lang: string }>();
  const r = getX(lang).register;
  const opened = useRef(Date.now());
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'err' | 'rate'>('idle');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries()); setState('busy');
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, elapsed: Date.now() - opened.current }) });
      if (res.status === 429) return setState('rate');
      if (!res.ok) return setState('err');
      setState('ok'); form.reset();
    } catch { setState('err'); }
  }
  return (
    <div className="login">
      <form onSubmit={submit} className="login-card">
        <Link href={`/${lang}`} className="brand"><Image src="/logo.png" alt="" width={48} height={48} /><span>TALANT</span></Link>
        <h1>{r.title}</h1>
        <label>{r.first}<input name="first" required minLength={2} maxLength={40} autoComplete="given-name" /></label>
        <label>{r.last}<input name="last" required minLength={2} maxLength={40} autoComplete="family-name" /></label>
        <label>{r.email}<input name="email" type="email" required maxLength={100} autoComplete="email" /></label>
        <label>{r.password}<input name="password" type="password" required minLength={8} maxLength={100} autoComplete="new-password" /></label>
        <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className="btn btn-amber" disabled={state === 'busy'}>{r.submit}</button>
        <p role="status" className={`form-msg ${state === 'ok' ? 'okc' : 'err'}`}>{state === 'ok' ? r.ok : state === 'err' ? r.err : state === 'rate' ? r.rate : ''}</p>
        <Link className="alt-link" href={`/${lang}/login`}>{r.haveAcc}</Link>
      </form>
    </div>
  );
}
