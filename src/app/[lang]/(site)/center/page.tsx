import { getT } from '@/lib/server-data';
import { getX } from '@/lib/x';
import { getList, getSettings, safeUrl } from '@/lib/server-data';
import PhotoReveal, { type Photo } from '@/components/PhotoReveal';

export const revalidate = 60;

export default async function Center({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = (await getT(lang)), x = getX(lang), s = await getSettings();
  const extra = await getList<{ photoUrl?: string; caption?: string }>('gallery');
  const photos: Photo[] = [
    { src: '/gallery/facade.jpg', w: 718, h: 1280, alt: t.place.alts[0] }, { src: '/gallery/class.jpg', w: 1179, h: 880, alt: t.place.alts[1] }, { src: '/gallery/class-board.jpg', w: 1179, h: 805, alt: t.place.alts[2] },
    ...extra.filter((g) => g.photoUrl).map((g) => ({ src: g.photoUrl as string, w: 1200, h: 900, alt: g.caption || 'TALANT' })),
  ];
  return (
    <>
      <section className="page-hero"><div className="orn" aria-hidden="true" /><div className="wrap"><h1>{t.place.title}</h1><p>{x.center.text}</p></div></section>
      <div className="wrap page">
        <section><h2>{t.why.title}</h2>
          <ul className="subj">{t.why.items.map((i) => (<li key={i.t}><b>{i.t}</b><span>{i.d}</span></li>))}</ul></section>
        <section><p className="lead">{s.address || t.contacts.address}</p>
          {s.mapUrl && <a className="btn btn-dark" href={safeUrl(s.mapUrl)} rel="noopener noreferrer">{x.center.route}</a>}</section>
        <section><PhotoReveal show={t.place.show} hide={t.place.hide} photos={photos} /></section>
      </div>
    </>
  );
}
