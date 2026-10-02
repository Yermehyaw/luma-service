import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') || '';
  const pathname = url.pathname;

  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'luma.com';
  const cleanHost = host.split(':')[0].toLowerCase();

  // 1. Local path development route: /tenant/[tenantId] or /tenant/[tenantId]/staff
  if (pathname.startsWith('/tenant/')) {
    return NextResponse.next();
  }

  // 2. Subdomain host resolution in production/subdomain mode:
  // e.g., acme-bank.luma.com -> rewrites to /tenant/acme-bank
  if (cleanHost.endsWith(`.${platformDomain}`)) {
    const subdomain = cleanHost.replace(`.${platformDomain}`, '');
    if (subdomain !== 'app' && subdomain !== 'www') {
      if (pathname === '/') {
        return NextResponse.rewrite(new URL(`/tenant/${subdomain}`, request.url));
      }
      if (pathname.startsWith('/staff')) {
        return NextResponse.rewrite(new URL(`/tenant/${subdomain}${pathname}`, request.url));
      }
      return NextResponse.rewrite(new URL(`/tenant/${subdomain}${pathname}`, request.url));
    }
  }

  // 3. Platform app resolution: app.luma.com -> rewrites to /platform/...
  if (cleanHost === `app.${platformDomain}`) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/platform/dashboard', request.url));
    }
    if (!pathname.startsWith('/platform')) {
      return NextResponse.rewrite(new URL(`/platform${pathname}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
