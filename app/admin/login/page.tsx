import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  async function loginAction(formData: FormData) {
    'use server';

    const username = String(formData.get('username') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');
    const expected = process.env.ADMIN_PASSWORD ?? '';
    const allowedUsers = new Set(['ece', 'eymen']);

    if (!expected || password !== expected || !allowedUsers.has(username)) {
      redirect('/admin/login?error=1');
    }

    const store = await cookies();
    store.set('admin_session', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    store.set('admin_user', username, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F0E6] px-6">
      <div className="w-full max-w-md rounded-2xl border border-beige bg-white p-8 shadow-[0_10px_30px_rgba(61,31,16,0.08)]">
        <p className="text-center text-xs tracking-[0.22em] text-terracotta">ADMIN</p>
        <h1 className="mt-3 text-center font-serif text-4xl text-brown-deep">Yönetim Paneli</h1>
        <p className="mt-2 text-center text-sm text-brown-deep/70">
          Kullanıcılar: <span className="font-medium text-brown-deep">ece</span>,{' '}
          <span className="font-medium text-brown-deep">eymen</span>
        </p>

        <form action={loginAction} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-brown-deep" htmlFor="username">
            Kullanıcı Adı
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="h-11 w-full rounded-lg border border-beige px-3 text-sm outline-none transition focus:border-terracotta"
            placeholder="ece veya eymen"
          />

          <label className="block text-sm font-medium text-brown-deep" htmlFor="password">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="h-11 w-full rounded-lg border border-beige px-3 text-sm outline-none transition focus:border-terracotta"
            placeholder="••••••••"
          />
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              Kullanıcı adı veya şifre hatalı. Tekrar deneyin.
            </p>
          ) : null}
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-terracotta px-4 text-sm font-medium text-cream transition hover:bg-terracotta-dark"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
