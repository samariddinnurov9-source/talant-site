import type { Metadata } from 'next';
import { Noto_Sans, Noto_Serif } from 'next/font/google';
import { getDict, locales } from '@/lib/i18n';
import Fx from '@/components/Fx';
import '../globals.css';

// Noto covers Cyrillic plus the Tajik letters (ӣ ӯ қ ҳ ҷ ғ).
const serif = Noto_Serif({ subsets: ['cyrillic', 'cyrillic-ext', 'latin'], weight: ['600', '800'], variable: '--f-serif', display: 'swap' });
const sans = Noto_Sans({ subsets: ['cyrillic', 'cyrillic-ext', 'latin'], weight: ['400', '600'], variable: '--f-sans', display: 'swap' });

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return {
    metadataBase: new URL(base),
    title: t.meta.title, description: t.meta.description, icons: { icon: '/icon.png' },
    alternates: { languages: { ru: '/ru', tg: '/tg' } },
    openGraph: { title: t.meta.title, description: t.meta.description, images: ['/logo.png'], locale: lang === 'tg' ? 'tg_TJ' : 'ru_RU', type: 'website' },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <html lang={lang === 'tg' ? 'tg' : 'ru'} className={`${serif.variable} ${sans.variable}`}>
      <body className="dk">
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <div className="scroll-progress" aria-hidden="true" />
        <Fx />
        {children}
      </body>
    </html>
  );
}
