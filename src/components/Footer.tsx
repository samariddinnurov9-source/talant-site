import Image from 'next/image';
import Link from 'next/link';
import { safeUrl, type Settings } from '@/lib/server-data';
import type { Dict } from '@/lib/i18n';
import type { X } from '@/lib/x';

export default function Footer({ t, x, lang, s, hasTeachers }: { t: Dict; x: X; lang: string; s: Settings; hasTeachers: boolean }) {
  const ig = s.instagram.replace(/\/$/, '').split('/').pop();
  return (
    <footer className="ftr" id="footer">
      <div className="orn" aria-hidden="true" />
      <div className="wrap ftr-grid">
        <div>
          <div className="brand brand-ftr"><Image src="/logo.png" alt="" width={52} height={52} /><span>TALANT</span></div>
          <p>МАРКАЗИ ОМӮЗИШИИ «ТАЛАНТ»</p><p className="soft">{t.footer.since}</p>
        </div>
        <div>
          <h3>{t.nav.col}</h3>
          <Link href={`/${lang}/cluster-5`}>{t.nav.cluster}</Link><Link href={`/${lang}/english`}>{x.nav.english}</Link>
          {hasTeachers && <Link href={`/${lang}/teachers`}>{x.nav.teachers}</Link>}
          <Link href={`/${lang}/center`}>{x.nav.center}</Link><Link href={`/${lang}/login`}>{x.nav.login}</Link>
        </div>
        <div>
          <h3>{t.nav.contactCol}</h3>
          <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>{s.phone}</a>
          <a href={safeUrl(s.whatsapp)} rel="noopener noreferrer">WhatsApp</a><a href={safeUrl(s.telegram)} rel="noopener noreferrer">Telegram</a>
          <a href={safeUrl(s.instagram)} rel="noopener noreferrer">@{ig}</a>
          <p className="soft">{s.address || t.contacts.address}</p>
          {s.hours && <p className="soft">{x.center.hours}: {s.hours}</p>}
          {s.mapUrl && <a href={safeUrl(s.mapUrl)} rel="noopener noreferrer">{x.center.route}</a>}
        </div>
      </div>
      <div className="flag" aria-hidden="true" />
    </footer>
  );
}
