'use client';
import { useParams } from 'next/navigation';
import { useStudent } from '@/lib/hooks';
import { getX } from '@/lib/x';

export default function Exams() {
  const { lang } = useParams<{ lang: string }>();
  const c = getX(lang).campus; const d = useStudent();
  if (d.loading) return <i className="spinner" />;
  const today = new Date().toISOString().slice(0, 10);
  const up = d.exams.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  return (<><h1 className="app-h">{c.exams}</h1>
    {!up.length ? <p className="muted">{c.noExams}</p> : (<ul className="rows">{up.map((e) => (<li key={e.id}><b>{e.date}{e.time ? ` · ${e.time}` : ''}</b><span>{e.title}</span><span /></li>))}</ul>)}</>);
}
