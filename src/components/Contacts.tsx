import { InstagramIcon, PhoneIcon, PinIcon, ClockIcon, TelegramIcon, WhatsAppIcon } from './Icons';
import { safeUrl, type Settings } from '@/lib/server-data';
import type { Dict } from '@/lib/i18n';
import type { X } from '@/lib/x';

// Premium contact block: brand icons for messengers, handset icon next to the phone number, address with a pin.
export default function Contacts({ t, x, s }: { t: Dict; x: X; s: Settings }) {
  const tel = `tel:${s.phone.replace(/[^\d+]/g, '')}`;
  const ig = s.instagram.replace(/\/$/, '').split('/').pop();
  const channels = [
    { k: 'wa', name: 'WhatsApp', sub: s.phone, href: safeUrl(s.whatsapp), icon: <WhatsAppIcon /> },
    { k: 'tg', name: 'Telegram', sub: s.phone, href: safeUrl(s.telegram), icon: <TelegramIcon /> },
    { k: 'ig', name: 'Instagram', sub: `@${ig}`, href: safeUrl(s.instagram), icon: <InstagramIcon /> },
  ];
  return (
    <section id="contacts" className="contact-sec">
      <div className="wrap contact-grid">
        <div className="contact-info" data-reveal>
          <p className="eyebrow">{t.nav.contacts}</p>
          <h2>{t.contacts.title}</h2>
          <p className="lead">{t.contacts.text}</p>
          <ul className="contact-list">
            <li>
              <span className="c-ico c-phone"><PhoneIcon /></span>
              <div><small>{t.contacts.phone}</small><a className="c-phone-num" href={tel}>{s.phone}</a></div>
            </li>
            <li>
              <span className="c-ico"><PinIcon /></span>
              <div><small>{t.contacts.addr}</small><span>{s.address || t.contacts.address}</span></div>
            </li>
            {s.hours && (
              <li>
                <span className="c-ico"><ClockIcon /></span>
                <div><small>{x.center.hours}</small><span>{s.hours}</span></div>
              </li>
            )}
          </ul>
          {s.mapUrl && <a className="btn btn-line" href={safeUrl(s.mapUrl)} rel="noopener noreferrer">{x.center.route}</a>}
        </div>
        <div className="channels">
          {channels.map((c, i) => (
            <a key={c.k} href={c.href} rel="noopener noreferrer" className={`channel ch-${c.k} glow-card`} data-reveal style={{ transitionDelay: `${(i + 1) * 110}ms` }}>
              <span className="ch-ico">{c.icon}</span>
              <span className="ch-txt"><b>{c.name}</b><small>{c.sub}</small></span>
              <span className="ch-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
