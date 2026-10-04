import Image from 'next/image';
import Link from 'next/link';
import { getX } from '@/lib/x';
import { getSettings, getT } from '@/lib/server-data';
import Icon from '@/components/Icon';
import Contacts from '@/components/Contacts';
import { EnglishArt, SubjectArt } from '@/components/Art';

export const revalidate = 60;
const okSrc = (u: string) => !!u && (u.startsWith('/gallery/') || u.startsWith('https://firebasestorage.googleapis.com/'));

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getT(lang), x = getX(lang), set = await getSettings();
  const kinds = ['chem', 'bio', 'phys', 'tj', 'en'] as const;
  const marq = [...t.marquee, ...t.marquee];
  const hero = okSrc(set.heroPhoto) ? set.heroPhoto : '/gallery/uni-tsmu.webp';
  const unis = [
    { src: okSrc(set.uniPhoto0) ? set.uniPhoto0 : '/gallery/uni-tsmu.webp', credit: set.uniCredit0 },
    { src: okSrc(set.uniPhoto1) ? set.uniPhoto1 : '/gallery/uni-khatlon.webp', credit: set.uniCredit1 },
  ];
  const ld = { '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: 'TALANT', alternateName: 'МАРКАЗИ ОМӮЗИШИИ «ТАЛАНТ»', foundingDate: '2023-09-01', address: { '@type': 'PostalAddress', addressLocality: 'Бохтар', addressCountry: 'TJ' }, sameAs: [set.instagram], telephone: set.phone };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <section className="hero">
        <Image className="hero-bg" src={hero} alt="" fill priority sizes="100vw" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="wrap hero-in">
          <div className="hero-txt">
            <h1 className="wordmark" aria-label="TALANT">
              {'TALANT'.split('').map((ch, i) => (<span key={i} aria-hidden="true" style={{ animationDelay: `${200 + i * 80}ms` }}>{ch}</span>))}
            </h1>
            <p className="hero-sub fade" style={{ animationDelay: '800ms' }}>{t.hero.sub}</p>
            <p className="hero-tags fade" style={{ animationDelay: '950ms' }}>{t.hero.tags}</p>
            <p className="hero-lead fade" style={{ animationDelay: '1100ms' }}>{t.hero.lead}</p>
            <div className="cta-row fade" style={{ animationDelay: '1250ms' }}>
              <a className="btn btn-amber" href="#contacts">{t.cta.apply}</a>
              <Link className="btn btn-line" href={`/${lang}/cluster-5`}>{t.cta.more}</Link>
            </div>
          </div>
          <div className="hero-art">
            <div className="emblem">
              <Image src="/emblem.webp" alt="TALANT — Маркази омӯзишӣ" width={900} height={900} priority sizes="(max-width:900px) 72vw, 370px" />
            </div>
            <div className="subjects">
              {t.hero.chips.map((c, k) => (
                <Link key={c} href={`/${lang}/${k === 4 ? 'english' : 'cluster-5'}`} className={`medal k-${kinds[k]}`} style={{ animationDelay: `${-k * 0.9}s` }}>
                  <span className="medal-art"><SubjectArt kind={kinds[k]} /></span><em>{c}</em>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="wrap stats-in">
          {t.stats.map((s) => {
            const num = /^\d+$/.test(s.n);
            return (<div key={s.l} data-reveal><b data-count={num ? s.n : undefined}>{s.n}</b><span>{s.l}</span></div>);
          })}
        </div>
      </section>

      <div className="marq" aria-hidden="true"><div className="marq-in">{marq.map((m, i) => (<span key={i}>{m}<i /></span>))}</div></div>

      <section className="about wrap">
        <div className="about-head" data-reveal>
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h2>{t.about.title}</h2>
          <p className="lead">{t.about.text}</p>
        </div>
        <ol className="about-points">
          {t.about.points.map((p, k) => (
            <li key={p.n} className="glow-card" data-reveal style={{ transitionDelay: `${k * 110}ms` }}>
              <span className="num">{p.n}</span><h3>{p.t}</h3><p>{p.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="why">
        <div className="wrap why-in">
          <h2 data-reveal>{t.why.title}</h2>
          <ul>
            {t.why.items.map((it, k) => (
              <li key={it.t} className={`w${k}`} data-reveal style={{ transitionDelay: `${k * 90}ms` }}>
                <span className="ico"><Icon name={it.i} /></span>
                <div><h3>{it.t}</h3><p>{it.d}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grades wrap">
        <p className="eyebrow" data-reveal>{t.grades.eyebrow}</p>
        <h2 data-reveal>{t.grades.title}</h2>
        <div className="grade-grid">
          {[{ g: 11, p: set.price11 }, { g: 10, p: set.price10 }, { g: 9, p: set.price9 }].filter((r) => r.p).map((r, k) => (
            <article key={r.g} className={`grade glow-card ${k === 0 ? 'top' : ''}`} data-reveal style={{ transitionDelay: `${k * 110}ms` }}>
              <span className="g-num">{r.g}</span><span className="g-word">{t.grades.word}</span>
              <div className="g-price"><b>{r.p}</b><small>{t.grades.perMonth}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="path wrap">
        <p className="eyebrow" data-reveal>{t.path.eyebrow}</p>
        <h2 data-reveal>{t.path.title}</h2>
        <ol className="steps-h">
          {t.path.steps.map((st, k) => (
            <li key={st.t} data-reveal style={{ transitionDelay: `${k * 100}ms` }}>
              <span className="dot">{k + 1}</span><h3>{st.t}</h3><p>{st.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="unis">
        <div className="wrap">
          <h2 data-reveal>{t.unis.title}</h2>
          <p className="lead" data-reveal>{t.unis.text}</p>
          <div className="uni-grid">
            {t.unis.items.map((u, k) => (
              <article key={u.city} className={`uni u${k}`} data-reveal style={{ transitionDelay: `${k * 140}ms` }}>
                <Image className="uni-bg" src={unis[k].src} alt={u.name} fill sizes="(max-width:800px) 100vw, 560px" />
                <span className="uni-shade" />
                <span className="uni-ghost" aria-hidden="true">{u.city}</span>
                <span className="uni-sub">{u.sub}</span>
                <span className="uni-city">{u.city}</span>
                <h3>{u.name}</h3>
                {unis[k].credit && <small className="uni-credit">{unis[k].credit}</small>}
              </article>
            ))}
          </div>
          <p className="muted small">{t.unis.note}</p>
        </div>
      </section>

      <section className="courses">
        <div className="wrap">
          <h2 data-reveal>{t.courses.title}</h2>
          <div className="course-grid">
            <Link href={`/${lang}/cluster-5`} className="course cl" data-reveal>
              <h3>{t.courses.cluster.t}</h3><p>{t.courses.cluster.d}</p><b>{t.courses.cluster.p}</b><span className="more">{t.cta.open} →</span>
            </Link>
            <Link href={`/${lang}/english`} className="course en" data-reveal style={{ transitionDelay: '140ms' }}>
              <EnglishArt /><h3>{t.courses.english.t}</h3><p>{t.courses.english.d}</p><ul className="facts"><li>A1–B1</li><li>{x.english.facts[0][1]}</li><li>{x.english.facts[1][1]}</li></ul><span className="more">{t.cta.open} →</span>
            </Link>
          </div>
        </div>
      </section>

      <Contacts t={t} x={x} s={set} />
    </>
  );
}
