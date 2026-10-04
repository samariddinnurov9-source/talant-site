'use client';
// Saving or deleting one weekly result (manual entry and Excel import share this).
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { fb } from './firebase';
import type { Exam, SubjectScore, UserDoc } from './types';

export type ResultInput = { total: number; subjects: SubjectScore[]; place?: number | null; participants?: number | null };

export async function saveResult(stu: Pick<UserDoc, 'id'>, exam: Exam, r: ResultInput) {
  if (!Number.isFinite(r.total) || r.total < 0 || r.total > exam.max) throw new Error('total');
  if (r.subjects.some((s) => !Number.isFinite(s.score) || s.score < 0)) throw new Error('subject');
  await setDoc(doc(fb().db, 'results', `${exam.id}_${stu.id}`), {
    uid: stu.id, examId: exam.id, examTitle: exam.title, examDate: exam.date, score: r.total, subjects: r.subjects,
    place: r.place && r.place > 0 ? Math.trunc(r.place) : null, participants: r.participants ?? null, updatedAt: serverTimestamp(),
  });
}
export const deleteResult = (uid: string, examId: string) => deleteDoc(doc(fb().db, 'results', `${examId}_${uid}`));
