'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Dict } from '@/lib/i18n';
import type { X } from '@/lib/x';

export default function Header({ lang, t, x, hasTeachers }: { lang: string; t: Dict; x: X; hasTeachers: boolean }) {
  const path = usePathname() || `/${lang}`;
  const rest = path.split('/').slice(2).join('/');
  const [open, setOpen] = useState(false);
  const href = (l: string) => `/${l}${rest ? `/${rest}` : ''}`;
  const links = [
    { h: `/${lang}`, l: t.nav.home }, { h: `/${lang}/cluster-5`, l: t.nav.cluster }, { h: `/${lang}/english`, l: x.nav.english },
    { h: `/${lang}/center`, l: x.nav.center }, ...(hasTeachers ? [{ h: `/${lang}/teachers`, l: x.nav.teachers }] : []), { h: `/${lang}#contacts`, l: t.nav.contacts },
  ];
  const close = () => setOpen(false);
  return (
    <header className="hdr">
      <div className="flag" aria-hidden="true" />
      <div className="wrap hdr-in">
        <Link href={`/${lang}`} className="brand" aria-label="TALANT"><Image src="/logo.png" alt="" width={42} height={42} priority /><span>TALANT</span></Link>
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main">
          {links.map((l) => (<Link key={l.h} href={l.h} onClick={close}>{l.l}</Link>))}
        </nav>
        <div className="hdr-right">
          <div className="lang" role="group" aria-label="Language">
            <Link href={href('tg')} aria-current={lang === 'tg'}>Тоҷ</Link>
            <Link href={href('ru')} aria-current={lang === 'ru'}>Рус</Link>
          </div>

          <button className="burger" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}><span /><span /><span /></button>
        </div>
      </div>
    </header>
  );
}
