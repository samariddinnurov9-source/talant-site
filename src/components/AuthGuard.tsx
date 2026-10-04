'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import type { Role } from '@/lib/types';

export default function AuthGuard({ lang, roles, children }: { lang: string; roles: Role[]; children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const ok = !!user && !!role && roles.includes(role);
  useEffect(() => { if (!loading && !ok) router.replace(`/${lang}/login`); }, [loading, ok, lang, router]);
  if (loading || !ok) return <div className="boot"><i className="spinner" /></div>;
  return <>{children}</>;
}
