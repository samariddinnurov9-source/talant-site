import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const pages = ['', '/cluster-5', '/english', '/center'];
  return ['tg', 'ru'].flatMap((l) => pages.map((p) => ({ url: `${base}/${l}${p}`, changeFrequency: 'weekly' as const })));
}
