'use client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { fb } from '@/lib/firebase';
import { dicts } from '@/lib/i18n';

const PATHS: [string, string][] = [['hero.sub', 'Главный экран: подзаголовок'], ['hero.tags', 'Главный экран: строка направлений'], ['hero.lead', 'Главный экран: описание'], ['why.title', 'Заголовок «Почему TALANT»'],
  ['unis.title', 'Университеты: заголовок'], ['unis.text', 'Университеты: текст'], ['unis.note', 'Университеты: примечание'], ['courses.title', 'Направления: заголовок'], ['courses.cluster.d', 'Карточка 5-го кластера: текст'],
  ['courses.english.d', 'Карточка английского: текст'], ['cluster.forWhom', 'Страница кластера: для кого'], ['footer.since', 'Футер: строка о дате основания']];
const get = (o: unknown, path: string) => path.split('.').reduce<unknown>((a, k) => (a && typeof a === 'object' ? (a as Record<string, unknown>)[k] : undefined), o);

export default function Content() {
  const [lang, setLang] = useState<'tg' | 'ru'>('tg'); const [all, setAll] = useState<Record<string, Record<string, string>>>({ tg: {}, ru: {} }); const [msg, setMsg] = useState('');
  useEffect(() => { getDoc(doc(fb().db, 'settings', 'content')).then((s) => { const d = s.data() ?? {}; setAll({ tg: d.tg ?? {}, ru: d.ru ?? {} }); }); }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault(); await setDoc(doc(fb().db, 'settings', 'content'), { [lang]: all[lang] }, { merge: true }); setMsg('Сохранено. Сайт обновится в течение минуты. Пустое поле = текст по умолчанию.');
  }
  return (<><h1 className="app-h">Тексты сайта</h1>
    <div className="filters"><button className={`pill ${lang === 'tg' ? 'on' : ''}`} onClick={() => setLang('tg')}>Тоҷикӣ</button><button className={`pill ${lang === 'ru' ? 'on' : ''}`} onClick={() => setLang('ru')}>Русский</button></div>
    <form className="adm-form" onSubmit={save}>
      {PATHS.map(([p, l]) => (<label key={p}>{l}<textarea rows={2} maxLength={500} value={all[lang][p] ?? ''} placeholder={String(get(dicts[lang], p) ?? '')}
        onChange={(e) => setAll({ ...all, [lang]: { ...all[lang], [p]: e.target.value } })} /></label>))}
      <button className="btn btn-dark">Сохранить</button><p className="form-msg">{msg}</p></form></>);
}
