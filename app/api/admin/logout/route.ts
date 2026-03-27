import { NextResponse } from 'next/server';

const clearedSession = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/admin',
  maxAge: 0,
};

/** GET: clears admin cookies and sends the browser to the login page. */
export async function GET(request: Request) {
  const login = new URL('/admin/login', request.url);
  const response = NextResponse.redirect(login);
  response.cookies.set('admin_session', '', clearedSession);
  response.cookies.set('admin_user', '', clearedSession);
  return response;
}
