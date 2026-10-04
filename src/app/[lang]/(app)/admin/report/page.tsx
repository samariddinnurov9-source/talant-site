'use client';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { fb } from '@/lib/firebase';
import { useCol } from '@/lib/hooks';
import type { Exam, Result, UserDoc } from '@/lib/types';

export default function Report() {
  const exams = useCol<Exam>('exams'); const users = useCol<UserDoc>('users');
  const [examId, setExamId] = useState(''); const [lang, setLang] = useState<'ru' | 'tg'>('ru'); const [rs, setRs] = useState<Result[]>([]); const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!examId) return;
    getDocs(query(collection(fb().db, 'results'), where('examId', '==', examId))).then((s) => setRs(s.docs.map((d) => ({ id: d.id, ...d.data() }) as Result)));
  }, [examId]);
  const exam = exams.items.find((e) => e.id === examId);
  const nameOf = (uid: string) => users.items.find((u) => u.id === uid)?.name ?? uid;
  const sorted = [...rs].sort((a, b) => (a.place ?? 1e9) - (b.place ?? 1e9) || b.score - a.score);
  const text = exam ? [`📊 ${exam.title} — ${exam.date}`, '', ...sorted.map((r, i) => {
    const p = r.place ?? i + 1; const parts = (r.subjects ?? []).map((s) => s.score).join('+');
    return lang === 'ru' ? `🏆 Место ${p}: ${nameOf(r.uid)} — Общий балл: ${r.score}${parts ? ` (${parts})` : ''}` : `🏆 Ҷои ${p}: ${nameOf(r.uid)} — Холи умумӣ: ${r.score}${parts ? ` (${parts})` : ''}`;
  })].join('\n') : '';
  return (<>
    <h1 className="app-h">Отчёт для WhatsApp</h1>
    <div className="adm-form row2">
      <label>Экзамен (неделя)<select value={examId} onChange={(e) => setExamId(e.target.value)}><option value="">— выберите —</option>{[...exams.items].sort((a, b) => b.date.localeCompare(a.date)).map((x) => (<option key={x.id} value={x.id}>{x.date} — {x.title}</option>))}</select></label>
      <label>Язык<select value={lang} onChange={(e) => setLang(e.target.value as 'ru' | 'tg')}><option value="ru">Русский</option><option value="tg">Тоҷикӣ</option></select></label>
    </div>
    {exam && (<><textarea className="report" readOnly rows={Math.min(24, sorted.length + 3)} value={text} />
      <div className="cta-row"><button className="btn btn-dark" onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>{copied ? 'Скопировано ✓' : 'Скопировать'}</button></div></>)}
  </>);
}
