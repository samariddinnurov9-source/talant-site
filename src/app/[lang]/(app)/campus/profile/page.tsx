'use client';
import { useParams } from 'next/navigation';
import { useStudent } from '@/lib/hooks';
import { getX } from '@/lib/x';

export default function Profile() {
  const { lang } = useParams<{ lang: string }>();
  const c = getX(lang).campus; const d = useStudent();
  if (d.loading) return <i className="spinner" />;
  const m = d.me;
  return (<><h1 className="app-h">{c.profile}</h1>
    <ul className="rows">{[[c.name, m?.name], [c.email, m?.email], [c.grade, m?.grade], [c.direction, c.directionValue]].map(([k, v]) => (<li key={k}><span>{k}</span><b>{v || '—'}</b><span /></li>))}</ul></>);
}
