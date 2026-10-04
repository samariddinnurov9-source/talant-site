'use client';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { signOut, useAuth } from '@/lib/auth';
import { fb } from '@/lib/firebase';
import { getX } from '@/lib/x';

function Gate({ lang, children }: { lang: string; children: React.ReactNode }) {
  const c = getX(lang).campus; const { user } = useAuth();
  const [approved, setApproved] = useState<boolean | null>(null);
  useEffect(() => { if (user) getDoc(doc(fb().db, 'users', user.uid)).then((s) => setApproved(s.data()?.approved !== false)).catch(() => setApproved(true)); }, [user]);
  if (approved === null) return <i className="spinner" />;
  if (!approved) return (<div className="pending"><h1 className="app-h">{c.pendingTitle}</h1><p className="lead">{c.pendingText}</p></div>);
  return <>{children}</>;
}

export default function CampusLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const c = getX(lang).campus; const path = usePathname();
  const items = [['', c.dashboard], ['/results', c.results], ['/progress', c.progress], ['/exams', c.exams], ['/profile', c.profile]];
  const { user } = useAuth();
  return (
    <AuthGuard lang={lang} roles={['student']}>
      <div className="app">
        <aside className="side">
          <Link href={`/${lang}`} className="brand"><Image src="/logo.png" alt="" width={40} height={40} /><span>CAMPUS</span></Link>
          <nav>{items.map(([h, l]) => { const href = `/${lang}/campus${h}`; return (<Link key={h} href={href} className={path === href ? 'on' : ''}>{l}</Link>); })}</nav>
          <div className="side-foot"><small>{user?.displayName}</small>
            <button className="btn btn-line" onClick={() => signOut()}>{c.logout}</button>
            <div className="lang-mini"><Link href={path.replace(/^\/(ru|tg)/, '/tg')}>Тоҷ</Link> · <Link href={path.replace(/^\/(ru|tg)/, '/ru')}>Рус</Link></div></div>
        </aside>
        <section className="app-main"><Gate lang={lang}>{children}</Gate></section>
      </div>
    </AuthGuard>
  );
}
