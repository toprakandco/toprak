'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

export function BlogNewsletter() {
  const t = useTranslations('blog.newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setStatus('loading');
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        if (!res.ok) {
          setStatus('err');
          return;
        }
        setStatus('ok');
        setEmail('');
      } catch {
        setStatus('err');
      }
    },
    [email],
  );

  return (
    <div
      className="break-inside-avoid overflow-hidden rounded-[20px] px-6 py-10 md:px-12 md:py-12"
      style={{
        background: 'linear-gradient(135deg, #8B3A1E, #6B2C14)',
      }}
    >
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="mb-5 text-[#F5F0E6]" aria-hidden>
          <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="8" width="24" height="18" rx="2" />
            <path d="M4 10l12 8 12-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-serif text-[28px] leading-tight text-[#F5F0E6]">{t('title')}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#F5F0E6]/70">{t('subtitle')}</p>

        {status === 'ok' ? (
          <p className="mt-8 text-sm font-medium text-[#F5F0E6]" role="status">
            {t('success')}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-stretch">
            <label className="sr-only" htmlFor="blog-newsletter-email">
              {t('emailLabel')}
            </label>
            <input
              id="blog-newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              placeholder={t('placeholder')}
              className="min-h-12 flex-1 rounded-full border-0 bg-white px-5 text-sm text-[#3D1F10] placeholder:text-[#3D1F10]/40 focus:outline-none focus:ring-2 focus:ring-[#C4824A]/50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="min-h-12 shrink-0 rounded-full bg-[#C4824A] px-8 text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#d4925a] disabled:opacity-60"
            >
              {status === 'loading' ? t('sending') : t('submit')}
            </button>
          </form>
        )}
        {status === 'err' ? (
          <p className="mt-3 text-xs text-[#F5F0E6]/80" role="alert">
            {t('error')}
          </p>
        ) : null}
      </div>
    </div>
  );
}
