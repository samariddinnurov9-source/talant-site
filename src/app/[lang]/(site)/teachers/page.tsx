import Image from 'next/image';
import { getX } from '@/lib/x';
import { getList } from '@/lib/server-data';

export const revalidate = 60;
type T = { name: string; subject: string; education: string; experience: string; achievements: string; photoUrl?: string };

export default async function Teachers({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const x = getX(lang).teachers, list = await getList<T>('teachers');
  return (
    <>
      <section className="page-hero"><div className="orn" aria-hidden="true" /><div className="wrap"><h1>{x.title}</h1></div></section>
      <div className="wrap page">
        {!list.length && <p className="muted">{x.empty}</p>}
        <div className="teach-grid">
          {list.map((t, k) => (
            <article key={t.id} className="teach" data-reveal style={{ transitionDelay: `${(k % 3) * 100}ms` }}>
              {t.photoUrl && <Image src={t.photoUrl} alt={t.name} width={480} height={560} sizes="(max-width:800px) 90vw, 340px" />}
              <h3>{t.name}</h3><b className="subj-tag">{t.subject}</b>
              {t.education && <p><span>{x.education}:</span> {t.education}</p>}
              {t.experience && <p><span>{x.experience}:</span> {t.experience}</p>}
              {t.achievements && <p><span>{x.achievements}:</span> {t.achievements}</p>}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
