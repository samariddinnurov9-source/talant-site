'use client';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { fb } from '@/lib/firebase';
import { useCol } from '@/lib/hooks';
import { toWebp } from '@/lib/image';

type F = { key: string; label: string; type?: 'text' | 'textarea' | 'number'; required?: boolean };
type Item = Record<string, string | number | undefined> & { id: string };

// Generic admin manager: list, add, edit, delete, reorder and optional image upload (WebP, resized in the browser).
export default function Crud({ coll, fields, image }: { coll: string; fields: F[]; image?: boolean }) {
  const { items, reload } = useCol<Item>(coll);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Item | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const sorted = [...items].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const { db, storage } = fb();
      const data: Record<string, unknown> = {};
      fields.forEach((f) => { const v = (form[f.key] ?? '').trim(); data[f.key] = f.type === 'number' ? (v === '' ? '' : Number(v)) : v; });
      if (file) {
        const blob = await toWebp(file);
        const path = `public/${coll}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        await uploadBytes(ref(storage, path), blob, { contentType: 'image/webp' });
        data.photoUrl = await getDownloadURL(ref(storage, path)); data.photoPath = path;
        if (editing?.photoPath) await deleteObject(ref(storage, String(editing.photoPath))).catch(() => undefined);
      }
      if (editing) await updateDoc(doc(db, coll, editing.id), data);
      else await addDoc(collection(db, coll), { ...data, order: Date.now() });
      setForm({}); setFile(null); setEditing(null); reload();
    } catch (x) { setErr(x instanceof Error ? x.message : 'error'); }
    setBusy(false);
  }
  async function remove(it: Item) {
    if (!confirm('Удалить?')) return;
    const { db, storage } = fb();
    if (it.photoPath) await deleteObject(ref(storage, String(it.photoPath))).catch(() => undefined);
    await deleteDoc(doc(db, coll, it.id)); reload();
  }
  async function move(i: number, dir: -1 | 1) {
    const a = sorted[i], b = sorted[i + dir]; if (!b) return;
    const { db } = fb();
    await Promise.all([updateDoc(doc(db, coll, a.id), { order: Number(b.order ?? 0) }), updateDoc(doc(db, coll, b.id), { order: Number(a.order ?? 0) })]); reload();
  }
  return (
    <div>
      <form className="adm-form" onSubmit={save}>
        {fields.map((f) => (
          <label key={f.key}>{f.label}
            {f.type === 'textarea' ? <textarea rows={3} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              : <input type={f.type === 'number' ? 'number' : 'text'} required={f.required} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
          </label>))}
        {image && <label>Фото (JPG/PNG/WebP)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>}
        <div className="cta-row"><button className="btn btn-dark" disabled={busy}>{editing ? 'Сохранить' : 'Добавить'}</button>
          {editing && <button type="button" className="btn" onClick={() => { setEditing(null); setForm({}); }}>Отмена</button>}</div>
        <p className="form-msg err">{err}</p>
      </form>
      <ul className="adm-list">
        {sorted.map((it, i) => (
          <li key={it.id}>
            {image && it.photoUrl && /* eslint-disable-next-line @next/next/no-img-element */ <img src={String(it.photoUrl)} alt="" loading="lazy" width={64} height={64} />}
            <span>{fields.slice(0, 2).map((f) => String(it[f.key] ?? '')).filter(Boolean).join(' — ') || it.id}</span>
            <span className="acts">
              <button onClick={() => move(i, -1)} aria-label="up">↑</button><button onClick={() => move(i, 1)} aria-label="down">↓</button>
              <button onClick={() => { setEditing(it); setForm(Object.fromEntries(fields.map((f) => [f.key, String(it[f.key] ?? '')]))); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Изм.</button>
              <button onClick={() => remove(it)}>Удал.</button>
            </span>
          </li>))}
      </ul>
    </div>
  );
}
