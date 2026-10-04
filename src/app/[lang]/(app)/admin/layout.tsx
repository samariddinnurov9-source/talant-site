'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { signOut, useAuth } from '@/lib/auth';

const ALL: [string, string][] = [['', 'Dashboard'], ['/students', 'Пользователи и роли'], ['/exams', 'Экзамены (недели)'], ['/import', 'Импорт ведомости'], ['/grades', 'Оценки вручную'], ['/report', 'Отчёт для WhatsApp'],
  ['/teachers', 'Преподаватели'], ['/gallery', 'Галерея'], ['/content', 'Тексты сайта'], ['/settings', 'Контакты, цены, фото']];
const TEACHER = ['/exams', '/import', '/grades', '/report'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>(); const path = usePathname(); const { role } = useAuth();
  const items = role === 'admin' ? ALL : ALL.filter(([h]) => TEACHER.includes(h));
  return (
    <AuthGuard lang={lang} roles={['admin', 'teacher']}>
      <div className="app">
        <aside className="side">
          <Link href={`/${lang}`} className="brand"><Image src="/logo.png" alt="" width={40} height={40} /><span>ADMIN</span></Link>
          <nav>{items.map(([h, l]) => { const href = `/${lang}/admin${h}`; return (<Link key={h} href={href} className={path === href ? 'on' : ''}>{l}</Link>); })}</nav>
          <div className="side-foot"><button className="btn btn-line" onClick={() => signOut()}>Выйти</button></div>
        </aside>
        <section className="app-main">{children}</section>
      </div>
    </AuthGuard>
  );
}
