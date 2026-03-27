import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const session = request.cookies.get('admin_session')?.value;

    if (!session && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (session && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  return intl(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*|admin).*)', '/admin/:path*'],
};
