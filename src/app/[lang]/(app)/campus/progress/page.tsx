'use client';
import { useParams } from 'next/navigation';
import { LineChart } from '@/components/Charts';
import { readiness, useStudent } from '@/lib/hooks';
import { getX } from '@/lib/x';

export default function Progress() {
  const { lang } = useParams<{ lang: string }>();
  const c = getX(lang).campus; const d = useStudent();
  if (d.loading) return <i className="spinner" />;
  const avg = d.results.length ? Math.round(d.results.reduce((s, r) => s + r.score, 0) / d.results.length) : 0;
  const max = Math.max(300, ...d.exams.map((e) => e.max));
  return (<><h1 className="app-h">{c.progress}</h1>
    {!d.results.length ? <p className="muted">{c.empty}</p> : (<>
      <div className="card-w"><LineChart max={max} points={d.results.map((r, i) => ({ label: `${c.week} ${i + 1}`, value: r.score }))} /></div>
      <p className="lead">{c.readiness}: <b className="amber">{readiness(d.results, d.exams)}%</b> · {c.avg}: <b>{avg}</b></p>
      <table className="prices"><thead><tr><th>{c.week}</th><th>{c.date}</th><th>{c.total}</th><th>{c.change}</th></tr></thead><tbody>
        {d.results.map((r, i) => { const dl = i ? r.score - d.results[i - 1].score : null; return (<tr key={r.id}><td>{i + 1}</td><td>{r.examDate}</td><td>{r.score}</td><td className={dl === null ? '' : dl >= 0 ? 'up' : 'down'}>{dl === null ? '—' : `${dl >= 0 ? '+' : ''}${dl}`}</td></tr>); })}
      </tbody></table></>)}</>);
}
