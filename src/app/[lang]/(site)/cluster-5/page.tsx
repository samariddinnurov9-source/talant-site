import Link from 'next/link';
import { getT } from '@/lib/server-data';
import { getSettings } from '@/lib/server-data';

export const revalidate = 60;

export default async function Cluster5({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = (await getT(lang)), c = t.cluster, s = await getSettings();
  const rows = [{ g: 11, p: s.price11 }, { g: 10, p: s.price10 }, { g: 9, p: s.price9 }].filter((r) => r.p);

  return (
    <>
      <section className="page-hero"><div className="orn" aria-hidden="true" /><div className="wrap"><h1>{c.title}</h1><p>{c.forWhom}</p></div></section>
      <div className="wrap page">
        <section data-reveal><h2>{c.subjects}</h2><ul className="subj">{c.subjectNames.map((n) => (<li key={n}><b>{n}</b></li>))}</ul></section>
        <section data-reveal>
          <h2>{c.prices}</h2>
          <table className="prices"><tbody>
            {rows.map((r) => (
              <tr key={r.g}>
                <th scope="row">{r.g} {c.grade}</th>
                <td><b>{r.p}</b> {c.price}</td>
              </tr>))}
          </tbody></table>
        </section>
        <section data-reveal><Link className="btn btn-dark" href={`/${lang}#contacts`}>{t.cta.apply}</Link></section>
      </div>
    </>
  );
}
