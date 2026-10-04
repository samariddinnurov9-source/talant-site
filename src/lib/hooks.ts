'use client';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from './auth';
import { fb } from './firebase';
import type { Exam, Result, UserDoc } from './types';

export function useStudent() {
  const { user } = useAuth();
  const [d, setD] = useState<{ loading: boolean; me?: UserDoc; results: Result[]; exams: Exam[] }>({ loading: true, results: [], exams: [] });
  useEffect(() => {
    if (!user) return;
    const { db } = fb();
    (async () => {
      const [me, r, e] = await Promise.all([getDoc(doc(db, 'users', user.uid)), getDocs(query(collection(db, 'results'), where('uid', '==', user.uid))), getDocs(collection(db, 'exams'))]);
      setD({
        loading: false, me: me.exists() ? ({ id: me.id, ...me.data() } as UserDoc) : undefined,
        results: r.docs.map((x) => ({ id: x.id, ...x.data() }) as Result).sort((a, c) => a.examDate.localeCompare(c.examDate)),
        exams: e.docs.map((x) => ({ id: x.id, ...x.data() }) as Exam),
      });
    })().catch(() => setD((p) => ({ ...p, loading: false })));
  }, [user]);
  return d;
}

export function useCol<T>(name: string, ...cons: Parameters<typeof query>[1][]) {
  const [items, setItems] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [n, setN] = useState(0);
  useEffect(() => {
    const ref = collection(fb().db, name);
    getDocs(cons.length ? query(ref, ...cons) : ref).then((s) => { setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }) as T & { id: string })); setLoading(false); }).catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, n]);
  return { items, loading, reload: () => setN((v) => v + 1) };
}

/** Readiness for Cluster 5, %: average of the last three weekly totals relative to the exam maximum. */
export function readiness(results: Result[], exams: Exam[]) {
  const last = results.slice(-3); if (!last.length) return 0;
  const pct = last.map((r) => (r.score / (exams.find((e) => e.id === r.examId)?.max ?? 300)) * 100);
  return Math.min(100, Math.round(pct.reduce((a, b) => a + b, 0) / pct.length));
}
