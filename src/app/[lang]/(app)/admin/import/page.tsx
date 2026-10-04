'use client';
import readXlsxFile from 'read-excel-file/browser';
import { useState } from 'react';
import { saveResult } from '@/lib/adminops';
import { useCol } from '@/lib/hooks';
import { nameKey } from '@/lib/names';
import type { Exam, SubjectScore, UserDoc } from '@/lib/types';

type Row = { name: string; subjects: SubjectScore[]; total: number; place: number | null; uid: string };
const num = (v: unknown) => { const n = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : NaN; };

function parseCsv(text: string): string[][] {
  const first = text.split(/\r?\n/)[0] ?? '';
  const delim = [';', '\t', ','].sort((a, b) => first.split(b).length - first.split(a).length)[0];
  const rows: string[][] = []; let row: string[] = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === delim) { row.push(cur); cur = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cur); cur = ''; rows.push(row); row = []; }
    else cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

// Layout: [name, subject 1..n, total, place]; headers (total / место / ҷой ...) are detected, otherwise the last two columns are used.
function toRows(table: string[][]): Row[] {
  const head = table[0].map((h) => String(h ?? '').trim()); const n = head.length;
  let placeI = head.findIndex((h, i) => i > 0 && /мест|ҷой|place|рейтинг/i.test(h));
  let totalI = head.findIndex((h, i) => i > 0 && /общ|умум|итог|сумм|total/i.test(h));
  if (placeI < 0 && n >= 5) placeI = n - 1;
  if (totalI < 0 && n >= 4) totalI = placeI >= 0 ? placeI - 1 : n - 1;
  const subj = head.map((_, i) => i).filter((i) => i > 0 && i !== placeI && i !== totalI);
  const rows: Row[] = table.slice(1).filter((r) => String(r[0] ?? '').trim()).map((r) => {
    const subjects = subj.map((i) => ({ name: head[i] || `#${i}`, score: num(r[i]) })).filter((s) => Number.isFinite(s.score));
    const sum = subjects.reduce((a, s) => a + s.score, 0); const t = totalI >= 0 ? num(r[totalI]) : NaN;
    const p = placeI >= 0 ? num(r[placeI]) : NaN;
    return { name: String(r[0]).trim(), subjects, total: Number.isFinite(t) ? t : sum, place: Number.isFinite(p) ? Math.trunc(p) : null, uid: '' };
  });
  if (rows.some((r) => r.place === null)) { const sorted = [...rows].sort((a, b) => b.total - a.total); rows.forEach((r) => { r.place = sorted.findIndex((s) => s.total === r.total) + 1; }); }
  return rows;
}

export default function Import() {
  const exams = useCol<Exam>('exams'); const users = useCol<UserDoc>('users');
  const [examId, setExamId] = useState(''); const [rows, setRows] = useState<Row[]>([]); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  const students = users.items.filter((u) => u.role === 'student').sort((a, b) => a.name.localeCompare(b.name));
  const exam = exams.items.find((e) => e.id === examId);

  async function onFile(f?: File) {
    if (!f) return; setMsg('');
    try {
      const table = f.name.toLowerCase().endsWith('.csv') ? parseCsv(await f.text()) : ((await readXlsxFile(f))[0]?.data ?? []).map((r) => r.map((c) => (c == null ? '' : String(c))));
      if (table.length < 2) throw new Error('empty');
      const map = new Map<string, string[]>();
      students.forEach((s) => { const k = s.nameKey || nameKey(s.name); map.set(k, [...(map.get(k) ?? []), s.id]); });
      setRows(toRows(table).map((r) => { const m = map.get(nameKey(r.name)); return { ...r, uid: m && m.length === 1 ? m[0] : '' }; }));
    } catch { setMsg('Не удалось прочитать файл (нужен .xlsx или .csv: ФИО, предметы, общий балл, место).'); }
  }
  async function run() {
    if (!exam) return; setBusy(true); setMsg(''); let ok = 0; const bad: string[] = [];
    for (const r of rows.filter((x) => x.uid)) {
      try { await saveResult({ id: r.uid }, exam, { total: r.total, subjects: r.subjects, place: r.place, participants: rows.length }); ok++; } catch { bad.push(r.name); }
    }
    setMsg(`Импортировано: ${ok}. Без связи пропущено: ${rows.filter((x) => !x.uid).length}.${bad.length ? ` Ошибка баллов (проверьте максимум): ${bad.join(', ')}` : ''}`); setBusy(false);
  }
  const unlinked = rows.filter((r) => !r.uid).length;
  return (<>
    <h1 className="app-h">Загрузка ведомости за неделю</h1>
    <div className="adm-form">
      <label>Экзамен (неделя)<select value={examId} onChange={(e) => setExamId(e.target.value)}><option value="">— выберите —</option>
        {[...exams.items].sort((a, b) => b.date.localeCompare(a.date)).map((x) => (<option key={x.id} value={x.id}>{x.date} — {x.title}</option>))}</select></label>
      <label>Файл XLSX или CSV<input type="file" accept=".xlsx,.csv" onChange={(e) => onFile(e.target.files?.[0])} /></label>
    </div>
    {rows.length > 0 && (<>
      <p className="muted">Строк: {rows.length}. Не найдено в базе: {unlinked}. Выберите ученика вручную там, где в ФИО опечатка.</p>
      <ul className="adm-list">{rows.map((r, i) => (
        <li key={i} className={r.uid ? '' : 'new'}>
          <span><b>{r.name}</b> · {r.subjects.map((s) => s.score).join('+')} = {r.total} · место {r.place ?? '—'}</span>
          <span className="acts"><select value={r.uid} onChange={(e) => setRows(rows.map((x, k) => (k === i ? { ...x, uid: e.target.value } : x)))}>
            <option value="">— не связано —</option>{students.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></span></li>))}</ul>
      <div className="cta-row"><button className="btn btn-dark" disabled={!exam || busy} onClick={run}>Импортировать</button></div></>)}
    <p className="form-msg">{msg}</p>
  </>);
}
