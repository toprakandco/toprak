'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const USERS = [
  { id: 'eymen', label: 'Eymen' },
  { id: 'ece', label: 'Ece' },
] as const;

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('eymen');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
      };
      if (!res.ok) {
        setError(data.error ?? 'Giriş başarısız');
        return;
      }
      router.push('/admin');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <div>
        <label
          className="mb-2 block font-sans text-sm font-medium text-[#3D1F10]"
          htmlFor="admin-username"
        >
          Yönetici
        </label>
        <select
          id="admin-username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-12 w-full rounded-lg border border-[#EDE4D3] bg-white px-3 font-sans text-sm text-[#3D1F10] outline-none transition focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/30"
        >
          {USERS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="mb-2 block font-sans text-sm font-medium text-[#3D1F10]"
          htmlFor="admin-password"
        >
          Şifre
        </label>
        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="h-12 w-full rounded-lg border border-[#EDE4D3] bg-white pr-12 pl-3 font-sans text-sm text-[#3D1F10] outline-none transition focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/30"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#6B4C35] transition hover:bg-[#F5F0E6] hover:text-[#3D1F10]"
            aria-label={show ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-[#8B3A1E]/10 px-3 py-2 font-sans text-sm text-[#8B3A1E]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-[#8B3A1E] font-sans text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#6B2C14] disabled:opacity-70"
      >
        {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
      </button>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 3l18 18M10.6 10.6a3 3 0 004.8 4.8M9.9 5.1A10.3 10.3 0 0112 5c6 0 10 7 10 7a18.5 18.5 0 01-5 5.2M6.2 6.2C3.6 8.1 2 12 2 12s4 7 10 7a9.7 9.7 0 004.7-1.2" />
    </svg>
  );
}
