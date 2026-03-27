import {
  adminDisplayName,
  normalizeAdminLoginId,
} from '@/lib/admin-users';
import { NextResponse } from 'next/server';

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/admin',
  maxAge: 86400,
};

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
  }

  const usernameRaw = typeof body.username === 'string' ? body.username : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const loginId = normalizeAdminLoginId(usernameRaw);

  if (!loginId) {
    return NextResponse.json(
      { error: 'Geçersiz kullanıcı adı. Yalnızca eymen veya ece.' },
      { status: 401 },
    );
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (expected == null || expected === '') {
    return NextResponse.json(
      { error: 'Sunucu yapılandırması eksik' },
      { status: 500 },
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: 'Hatalı şifre' }, { status: 401 });
  }

  const res = NextResponse.json({
    success: true,
    displayName: adminDisplayName(loginId),
  });

  res.cookies.set('admin_session', 'true', cookieBase);
  res.cookies.set('admin_user', loginId, cookieBase);

  return res;
}
