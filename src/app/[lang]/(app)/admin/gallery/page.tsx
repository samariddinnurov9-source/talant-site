'use client';
import Crud from '@/components/Crud';
export default function Page() { return (<><h1 className="app-h">Галерея</h1><Crud coll="gallery" image fields={[{ key: 'caption', label: 'Подпись' }]} /></>); }
