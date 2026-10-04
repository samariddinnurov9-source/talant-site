import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Redirect "/" and any path without a locale to the default locale (Tajik).
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (/^\/(tg|ru)(\/|$)/.test(pathname)) return NextResponse.next();
  const rest = pathname === '/' ? '' : pathname;
  return NextResponse.redirect(new URL(`/tg${rest}`, req.url));
}
export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };
