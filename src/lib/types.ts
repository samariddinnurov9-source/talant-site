export type Role = 'admin' | 'teacher' | 'student';
export type UserDoc = { id: string; name: string; nameKey?: string; login: string; email: string; role: Role; grade?: string; phone?: string; blocked?: boolean; approved?: boolean };
export type Exam = { id: string; title: string; date: string; time?: string; max: number; subjects?: string[] };
export type SubjectScore = { name: string; score: number };
export type Result = { id: string; uid: string; examId: string; examTitle: string; examDate: string; score: number; subjects?: SubjectScore[]; place?: number | null; participants?: number | null };
