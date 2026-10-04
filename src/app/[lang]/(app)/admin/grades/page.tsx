'use client';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { deleteResult, saveResult } from '@/lib/adminops';
import { fb } from '@/lib/firebase';
import { useCol } from '@/lib/hooks';
import type { Exam, Result, UserDoc } from '@/lib/types';

type V = { s: string[]; place: string };

export default function Grades() {
  const exams = useCol<Exam>('exams'); const users = useCol<UserDoc>('users');
  const [examId, setExamId] = useState(''); const [vals, setVals] = useState<Record<string, V>>({}); const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState(''); const [parts, setParts] = useState(''); const [msg, setMsg] = useState('');
  const exam = exams.items.find((e) => e.id === examId);
  const names = exam?.subjects?.length ? exam.subjects : ['Предмет 1', 'Предмет 2', 'Предмет 3'];
  const students = users.items.filter((u) => u.role === 'student' && !u.blocked).sort((a, b) => a.name.localeCompare(b.name));

  const load = useCallback(async () => {
    if (!examId) return;
    const s = await getDocs(query(collection(fb().db, 'results'), where('examId', '==', examId)));
    const v: Record<string, V> = {}, sv: Record<string, boolean> = {}; let p = 0;
    s.docs.forEach((d) => { const r = d.data() as Result; v[r.uid] = { s: (r.subjects ?? []).map((x) => String(x.score)), place: r.place ? String(r.place) : '' }; sv[r.uid] = true; p = Math.max(p, r.participants ?? 0); });
    setVals(v); setSaved(sv); setParts(p ? String(p) : '');
  }, [examId]);
  useEffect(() => { load(); }, [load]);

  const get = (id: string): V => vals[id] ?? { s: [], place: '' };
  const total = (id: string) => names.reduce((a, _, i) => a + (Number(get(id).s[i]) || 0), 0);
  async function save(u: UserDoc) {
    if (!exam) return; const v = get(u.id);
    if (!v.s.some((x) => x !== '')) return;
    try {
      await saveResult(u, exam, { total: total(u.id), subjects: names.map((n, i) => ({ name: n, score: Number(v.s[i]) || 0 })), place: Number(v.place) || null, participants: Number(parts) || null });
      setSaved((s) => ({ ...s, [u.id]: true })); setMsg('');
    } catch { setMsg(`Проверьте баллы для ${u.name} (общий не больше ${exam.max})`); }
  }
  const set = (id: string, patch: Partial<V>) => { setVals({ ...vals, [id]: { ...get(id), ...patch } }); setSaved({ ...saved, [id]: false }); };
  return (<>
    <h1 className="app-h">Оценки вручную</h1>
    <div className="adm-form"><label>Экзамен (неделя)<select value={examId} onChange={(e) => setExamId(e.target.value)}><option value="">— выберите —</option>
      {[...exams.items].sort((a, b) => b.date.localeCompare(a.date)).map((x) => (<option key={x.id} value={x.id}>{x.date} — {x.title}</option>))}</select></label></div>
    {exam && (<>
      <div className="row2 adm-form"><input className="search" placeholder="Поиск ученика" value={q} onChange={(e) => setQ(e.target.value)} />
        <label>Всего участников (для «место из N»)<input type="number" min={1} value={parts} onChange={(e) => setParts(e.target.value)} /></label></div>
      <ul className="adm-list">{students.filter((u) => u.name.toLowerCase().includes(q.toLowerCase())).map((u) => (
        <li key={u.id}><span>{u.name}</span>
          <span className="acts">
            {names.map((n, i) => (<input key={n + i} className="score" type="number" min={0} placeholder={n} title={n} value={get(u.id).s[i] ?? ''} onChange={(e) => { const s = [...get(u.id).s]; s[i] = e.target.value; set(u.id, { s }); }} />))}
            <b>= {total(u.id)}</b>
            <input className="score" type="number" min={1} placeholder="место" value={get(u.id).place} onChange={(e) => set(u.id, { place: e.target.value })} />
            <button onClick={() => save(u)}>{saved[u.id] ? '✓' : 'Сохр.'}</button>
            {saved[u.id] && <button onClick={async () => { if (confirm('Удалить результат?')) { await deleteResult(u.id, exam.id); setVals((v) => { const n = { ...v }; delete n[u.id]; return n; }); setSaved((s) => ({ ...s, [u.id]: false })); } }}>Удал.</button>}
          </span></li>))}</ul></>)}
    <p className="form-msg">{msg}</p>
  </>);
}
