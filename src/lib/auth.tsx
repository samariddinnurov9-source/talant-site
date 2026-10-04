'use client';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut, type User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { fb, firebaseConfigured } from './firebase';
import type { Role } from './types';

type Ctx = { user: User | null; role: Role | null; loading: boolean };
const C = createContext<Ctx>({ user: null, role: null, loading: true });
export const useAuth = () => useContext(C);

export const toEmail = (login: string) => {
  const l = login.trim().toLowerCase();
  return l.includes('@') ? l : `${l.replace(/[^a-z0-9._-]/g, '')}@talant.app`;
};
export const signIn = (login: string, password: string) => signInWithEmailAndPassword(fb().auth, toEmail(login), password);
export const signOut = () => fbSignOut(fb().auth);

export async function api(path: string, method: string, body?: unknown) {
  const token = await fb().auth.currentUser?.getIdToken();
  const r = await fetch(path, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(String(j.error ?? r.status));
  return j;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [s, set] = useState<Ctx>({ user: null, role: null, loading: firebaseConfigured });
  useEffect(() => {
    if (!firebaseConfigured) return;
    return onAuthStateChanged(fb().auth, async (u) => {
      const role = u ? (((await u.getIdTokenResult()).claims.role as Role) ?? null) : null;
      set({ user: u, role, loading: false });
    });
  }, []);
  return <C.Provider value={s}>{children}</C.Provider>;
}
