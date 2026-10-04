import Link from 'next/link';
import { getT } from '@/lib/server-data';
import { getX } from '@/lib/x';
import { EnglishArt } from '@/components/Art';

export const revalidate = 60;

export default async function English({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = (await getT(lang)), e = getX(lang).english;
  return (
    <>
      <section className="page-hero"><div className="orn" aria-hidden="true" /><EnglishArt /><div className="wrap"><h1>{e.title}</h1><p>{e.lead}</p></div></section>
      <div className="wrap page">
        <section data-reveal><h2>{e.levels}</h2><ul className="subj">{e.levelList.map((l) => (<li key={l}><b>{l}</b></li>))}</ul></section>
        <section data-reveal>
          <ul className="subj">{e.facts.map(([k, v]) => (<li key={k}><b>{k}</b><span>{v}</span></li>))}</ul>
        </section>
        <section data-reveal><Link className="btn btn-dark" href={`/${lang}#contacts`}>{t.cta.apply}</Link></section>
      </div>
    </>
  );
}
