'use client';
import { useParams } from 'next/navigation';
import { useStudent } from '@/lib/hooks';
import { getX } from '@/lib/x';

export default function Results() {
  const { lang } = useParams<{ lang: string }>();
  const c = getX(lang).campus; const d = useStudent();
  if (d.loading) return <i className="spinner" />;
  return (<><h1 className="app-h">{c.results}</h1>
    {!d.results.length ? <p className="muted">{c.empty}</p> : (
      <div className="res-cards">{[...d.results].reverse().map((r) => (
        <article key={r.id} className="res-card">
          <header><b>{r.examTitle}</b><span className="muted">{r.examDate}</span></header>
          {r.subjects && r.subjects.length > 0 && <ul className="chips">{r.subjects.map((s) => (<li key={s.name}><span>{s.name}</span><b>{s.score}</b></li>))}</ul>}
          <footer><span>{c.total}: <b>{r.score}</b></span>{r.place && <span className="amber">{c.placeOf.replace('{p}', String(r.place)).replace('{n}', String(r.participants ?? '—'))}</span>}</footer>
        </article>))}</div>)}</>);
}
