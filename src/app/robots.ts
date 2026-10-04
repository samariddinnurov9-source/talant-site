import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/ru/admin', '/tg/admin', '/ru/campus', '/tg/campus', '/ru/login', '/tg/login', '/ru/register', '/tg/register'] }], sitemap: `${base}/sitemap.xml` };
}
