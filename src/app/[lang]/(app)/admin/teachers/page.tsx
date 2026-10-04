'use client';
import Crud from '@/components/Crud';
export default function Page() {
  return (<><h1 className="app-h">Преподаватели</h1><Crud coll="teachers" image fields={[{ key: 'name', label: 'ФИО', required: true }, { key: 'subject', label: 'Предмет', required: true },
    { key: 'education', label: 'Образование', type: 'textarea' }, { key: 'experience', label: 'Опыт', type: 'textarea' }, { key: 'achievements', label: 'Достижения', type: 'textarea' }]} /></>);
}
