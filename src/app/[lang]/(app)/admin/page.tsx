'use client';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { fb } from '@/lib/firebase';

export default function Dash() {
  const [n, setN] = useState<Record<string, number>>({});
  useEffect(() => {
    const { db } = fb();
    const cnt = async (q: ReturnType<typeof query>) => (await getCountFromServer(q)).data().count;
    (async () => setN({
      students: await cnt(query(collection(db, 'users'), where('role', '==', 'student'))),
      pending: await cnt(query(collection(db, 'users'), where('approved', '==', false))),
      exams: await cnt(collection(db, 'exams')), results: await cnt(collection(db, 'results')),
    }))().catch(() => undefined);
  }, []);
  const w: [string, string][] = [['students', 'Ученики'], ['pending', 'Ждут подтверждения'], ['exams', 'Экзамены'], ['results', 'Результатов в базе']];
  return (<><h1 className="app-h">Dashboard</h1><div className="widgets">{w.map(([k, l]) => (<div className="w" key={k}><small>{l}</small><b>{n[k] ?? '…'}</b></div>))}</div></>);
}
