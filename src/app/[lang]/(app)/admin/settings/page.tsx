'use client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { fb } from '@/lib/firebase';
import { toWebp } from '@/lib/image';

const F: [string, string, boolean][] = [['phone', 'Телефон', false], ['whatsapp', 'WhatsApp (ссылка https://wa.me/...)', false], ['telegram', 'Telegram (ссылка https://t.me/...)', false],
  ['instagram', 'Instagram (ссылка https://instagram.com/...)', false], ['address', 'Адрес', false], ['hours', 'Часы работы', false], ['mapUrl', 'Ссылка на карту (https://...)', false],
  ['price11', 'Цена, 11 класс (сомони/мес.)', true], ['price10', 'Цена, 10 класс', true], ['price9', 'Цена, 9 класс', true], ['uniCredit0', 'Подпись к фото ТГМУ (автор/источник, необязательно)', false], ['uniCredit1', 'Подпись к фото Хатлонского университета (необязательно)', false]];
const PHOTOS: [string, string][] = [['heroPhoto', 'Фон главного баннера (необязательно)'], ['uniPhoto0', 'Фон: ТГМУ имени Абуали ибни Сино (Душанбе)'], ['uniPhoto1', 'Фон: Хатлонский медуниверситет (Дангара)']];

export default function Settings() {
  const [v, setV] = useState<Record<string, string>>({}); const [msg, setMsg] = useState(''); const [up, setUp] = useState('');
  useEffect(() => { getDoc(doc(fb().db, 'settings', 'site')).then((s) => setV(Object.fromEntries(Object.entries(s.data() ?? {}).map(([k, x]) => [k, x == null ? '' : String(x)])))); }, []);
  async function upload(key: string, file?: File | null) {
    if (!file) return; setUp(key); setMsg('');
    try {
      const { storage } = fb(); const path = `public/settings/${key}-${Date.now()}.webp`;
      await uploadBytes(ref(storage, path), await toWebp(file, 1800), { contentType: 'image/webp' });
      setV((p) => ({ ...p, [key]: '' })); const url = await getDownloadURL(ref(storage, path));
      setV((p) => ({ ...p, [key]: url })); setMsg('Фото загружено. Нажмите «Сохранить».');
    } catch { setMsg('Не удалось загрузить фото (нужен JPG/PNG/WebP до 12 МБ).'); }
    setUp('');
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const data: Record<string, unknown> = Object.fromEntries(F.map(([k, , num]) => [k, num ? (v[k] ? Number(v[k]) : null) : (v[k] ?? '').trim()]));
    PHOTOS.forEach(([k]) => { data[k] = v[k] ?? ''; });
    await setDoc(doc(fb().db, 'settings', 'site'), data, { merge: true }); setMsg('Сохранено. Сайт обновится в течение минуты.');
  }
  return (<><h1 className="app-h">Контакты и цены</h1>
    <form className="adm-form" onSubmit={save}>
      {F.map(([k, l, num]) => (<label key={k}>{l}<input type={num ? 'number' : 'text'} value={v[k] ?? ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} maxLength={300} /></label>))}
      <h2 className="app-h2">Фото на главной</h2>
      {PHOTOS.map(([k, l]) => (<label key={k}>{l}
        {v[k] && /* eslint-disable-next-line @next/next/no-img-element */ <img src={v[k]} alt="" width={160} height={90} style={{ objectFit: 'cover', borderRadius: 12 }} />}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(k, e.target.files?.[0])} />{up === k && <small>Загрузка…</small>}</label>))}
      <button className="btn btn-dark">Сохранить</button><p className="form-msg">{msg}</p></form></>);
}
