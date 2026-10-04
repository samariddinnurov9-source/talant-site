'use client';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { api } from '@/lib/auth';
import { fb } from '@/lib/firebase';
import { useCol } from '@/lib/hooks';
import type { Result, UserDoc } from '@/lib/types';

const ROLE: Record<string, string> = { student: 'ученик', teacher: 'преподаватель', admin: 'админ' };

export default function Users() {
  const { items, reload } = useCol<UserDoc>('users');
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  const [hist, setHist] = useState<{ id: string; rows: Result[] } | null>(null);
  const list = [...items].sort((a, b) => Number(a.approved !== false) - Number(b.approved !== false) || a.name.localeCompare(b.name));
  const run = async (fn: () => Promise<unknown>) => { setMsg(''); try { await fn(); reload(); } catch (x) { setMsg(`Ошибка: ${x instanceof Error ? x.message : ''}`); } };
  const patch = (uid: string, body: object) => run(() => api('/api/admin/students', 'PATCH', { uid, ...body }));

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const f = Object.fromEntries(new FormData(form).entries()); setBusy(true);
    await run(async () => { await api('/api/admin/students', 'POST', f); form.reset(); setMsg('Создано'); }); setBusy(false);
  }
  async function showHist(u: UserDoc) {
    const s = await getDocs(query(collection(fb().db, 'results'), where('uid', '==', u.id)));
    setHist({ id: u.id, rows: s.docs.map((d) => ({ id: d.id, ...d.data() }) as Result).sort((a, b) => b.examDate.localeCompare(a.examDate)) });
  }
  return (<>
    <h1 className="app-h">Пользователи и роли</h1>
    <form className="adm-form" onSubmit={create}>
      <div className="row2"><label>Имя и фамилия<input name="name" required maxLength={80} /></label><label>Email или логин<input name="login" required minLength={3} maxLength={80} autoComplete="off" /></label></div>
      <div className="row2"><label>Пароль (от 8 символов)<input name="password" required minLength={8} maxLength={100} autoComplete="new-password" /></label><label>Телефон<input name="phone" maxLength={24} /></label></div>
      <div className="row2"><label>Класс<select name="grade"><option>9</option><option>10</option><option>11</option></select></label>
        <label>Роль<select name="role"><option value="student">Ученик</option><option value="teacher">Преподаватель</option><option value="admin">Админ</option></select></label></div>
      <button className="btn btn-dark" disabled={busy}>Добавить</button><p className="form-msg">{msg}</p>
    </form>
    <ul className="adm-list">{list.map((u) => (
      <li key={u.id} className={`${u.blocked ? 'blocked' : ''} ${u.approved === false ? 'new' : ''}`}>
        <span><b>{u.name}</b> · {u.email} · {ROLE[u.role]}{u.grade ? ` · ${u.grade} кл.` : ''}{u.approved === false ? ' · ждёт подтверждения' : ''}{u.blocked ? ' · заблокирован' : ''}</span>
        <span className="acts">
          {u.approved === false && <button onClick={() => patch(u.id, { action: 'approve' })}>Подтвердить</button>}
          <button onClick={() => showHist(u)}>История</button>
          <select value={u.role} aria-label="role" onChange={(e) => confirm('Сменить роль?') && patch(u.id, { action: 'role', role: e.target.value })}>{Object.entries(ROLE).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select>
          <button onClick={() => { const name = prompt('Имя и фамилия', u.name); const email = name && prompt('Email', u.email); if (name && email) patch(u.id, { action: 'update', name, email, phone: u.phone ?? '', grade: u.grade ?? '' }); }}>Ред.</button>
          <button onClick={() => { const p = prompt('Новый пароль (от 8 символов)'); if (p) patch(u.id, { action: 'password', password: p }); }}>Пароль</button>
          <button onClick={() => patch(u.id, { action: 'block', blocked: !u.blocked })}>{u.blocked ? 'Разблок.' : 'Блок.'}</button>
          <button onClick={() => confirm(`Удалить ${u.name} и все его результаты?`) && run(() => api(`/api/admin/students?uid=${u.id}`, 'DELETE'))}>Удал.</button>
        </span>
        {hist?.id === u.id && <ul className="hist">{hist.rows.length ? hist.rows.map((r) => (<li key={r.id}>{r.examDate} — {r.examTitle}: <b>{r.score}</b>{r.place ? ` · место ${r.place}` : ''}</li>)) : <li>Нет результатов</li>}</ul>}
      </li>))}</ul>
  </>);
}
