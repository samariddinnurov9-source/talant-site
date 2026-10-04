'use client';
import { useParams } from 'next/navigation';
import { Ring } from '@/components/Charts';
import { readiness, useStudent } from '@/lib/hooks';
import { getX } from '@/lib/x';

export default function Dashboard() {
  const { lang } = useParams<{ lang: string }>();
  const c = getX(lang).campus; const d = useStudent();
  if (d.loading) return <i className="spinner" />;
  const last = d.results.at(-1), prev = d.results.at(-2);
  const pct = readiness(d.results, d.exams);
  const growth = last && prev && prev.score > 0 ? Math.round(((last.score - prev.score) / prev.score) * 100) : 0;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = d.exams.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const name = d.me?.name ?? '', initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  const placeText = last?.place ? c.placeOf.replace('{p}', String(last.place)).replace('{n}', String(last.participants ?? '—')) : '—';
  return (<>
    <div className="profile-card">
      <span className="avatar">{initials}</span>
      <div><h1>{c.hello}, {name.split(' ')[0]}</h1><p>{name}{d.me?.grade ? ` · ${c.grade} ${d.me.grade}` : ''}</p><p className="amber">{c.direction}: {c.directionValue}</p></div>
    </div>
    <div className="badges">
      {last?.place && last.place <= 5 && <span className="badge">{c.top5}</span>}
      {growth > 0 && <span className="badge">{c.growth.replace('{n}', String(growth))}</span>}
    </div>
    <div className="widgets">
      <div className="w-score">{last ? <Ring value={pct} max={100} unit="%" label={c.readiness} /> : <p>{c.empty}</p>}</div>
      <div className="w"><small>{c.last}</small><b>{last ? last.score : '—'}</b><span>{last ? last.examTitle : c.empty}</span></div>
      <div className="w"><small>{c.place}</small><b>{last?.place ?? '—'}</b><span>{placeText}</span></div>
    </div>
    <h2 className="app-h2">{c.exams}</h2>
    {!upcoming.length ? <p className="muted">{c.noExams}</p> : (
      <ul className="rows">{upcoming.map((e) => (<li key={e.id}><span>{e.date}{e.time ? ` · ${e.time}` : ''}</span><span>{e.title}</span><b /></li>))}</ul>)}
  </>);
}
