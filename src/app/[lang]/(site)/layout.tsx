import { getT } from '@/lib/server-data';
import { getX } from '@/lib/x';
import { getList, getSettings } from '@/lib/server-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const revalidate = 60;

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = (await getT(lang)), x = getX(lang), s = await getSettings();
  const hasTeachers = (await getList('teachers')).length > 0;
  return (<><Header lang={lang} t={t} x={x} hasTeachers={hasTeachers} /><main>{children}</main><Footer t={t} x={x} lang={lang} s={s} hasTeachers={hasTeachers} /></>);
}
