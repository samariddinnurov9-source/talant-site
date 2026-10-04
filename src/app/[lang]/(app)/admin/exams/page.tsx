'use client';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { fb } from '@/lib/firebase';
import { useCol } from '@/lib/hooks';
import type { Exam } from '@/lib/types';

export default function Exams() {
  const { items, reload } = useCol<Exam>('exams');
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const f = new FormData(form);
    const subjects = ['s1', 's2', 's3'].map((k) => String(f.get(k)).trim()).filter(Boolean);
    await addDoc(collection(fb().db, 'exams'), { title: String(f.get('title')).trim(), date: String(f.get('date')), time: String(f.get('time') ?? ''), max: Number(f.get('max')) || 300, subjects });
    form.reset(); reload();
  }
  return (<><h1 className="app-h">Экзамены (недели)</h1>
    <p className="muted">Один экзамен = одна неделя ведомости. «Макс. балл» нужен для шкалы готовности.</p>
    <form className="adm-form" onSubmit={add}>
      <div className="row2"><label>Название<input name="title" required maxLength={80} placeholder="Неделя 1" /></label><label>Макс. общий балл<input name="max" type="number" min={1} defaultValue={300} /></label></div>
      <div className="row2"><label>Дата<input name="date" type="date" required /></label><label>Время<input name="time" type="time" /></label></div>
      <div className="row2"><label>Предмет 1<input name="s1" defaultValue="Химия" /></label><label>Предмет 2<input name="s2" defaultValue="Биология" /></label></div>
      <label>Предмет 3<input name="s3" defaultValue="Физика" /></label>
      <button className="btn btn-dark">Создать</button></form>
    <ul className="adm-list">{[...items].sort((a, b) => b.date.localeCompare(a.date)).map((x) => (
      <li key={x.id}><span>{x.date}{x.time ? ` ${x.time}` : ''} — {x.title} (макс. {x.max}; {(x.subjects ?? []).join(', ')})</span>
        <span className="acts"><button onClick={async () => { if (confirm('Удалить экзамен? Внесённые результаты останутся.')) { await deleteDoc(doc(fb().db, 'exams', x.id)); reload(); } }}>Удал.</button></span></li>))}</ul></>);
}
