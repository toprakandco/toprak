import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
// Public locales: tr, en, de, fr — defined in i18n/routing.ts (middleware uses same routing).
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

function isAdminLoginPath(pathname: string) {
  return pathname === '/admin/login' || pathname.startsWith('/admin/login/');
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Yönetim paneli: next-intl çalıştırılmaz; yalnızca oturum kontrolü.
  if (pathname.startsWith('/admin')) {
    const sessionOk =
      request.cookies.get('admin_session')?.value === 'true';

    if (!sessionOk && !isAdminLoginPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = '';
      return NextResponse.redirect(url);
    }

    if (sessionOk && isAdminLoginPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      url.search = '';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return intl(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*|admin).*)',
    '/admin',
    '/admin/:path*',
  ],
};
