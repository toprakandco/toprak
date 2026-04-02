'use client';

import {
  formatTurkishGsmDisplay,
  isValidTurkishGsm11,
  parseTurkishGsmDigits,
} from '@/lib/phone-tr';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

const PREFERRED_OPTIONS = [
  { value: 'morning', key: 'morning' as const },
  { value: 'noon', key: 'noon' as const },
  { value: 'evening', key: 'evening' as const },
  { value: 'any', key: 'any' as const },
];

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

export function CallbackWidget() {
  const t = useTranslations('contact.callbackWidget');
  const [phone, setPhone] = useState('');
  const [preferred, setPreferred] = useState('any');
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  const onPhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = parseTurkishGsmDigits(e.target.value);
    setPhone(formatTurkishGsmDisplay(digits));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saved) return;
    const digits = parseTurkishGsmDigits(phone);
    if (!isValidTurkishGsm11(digits)) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitting(true);
    try {
      const res = await fetch('/api/callback-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: digits,
          preferred_time: preferred,
        }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        setError(true);
        return;
      }
      setSaved(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="w-full rounded-2xl border border-[#C0DD97] p-7 shadow-sm md:p-8"
      style={{
        background: 'linear-gradient(135deg, #EAF3DE, #F5F0E6)',
        borderWidth: '0.5px',
      }}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="shrink-0 pt-0.5">
            <PhoneIcon className="h-8 w-8 text-accent-dark" />
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-[20px] leading-snug text-[#3D1F10]">
              {t('title')}
            </h2>
            <p className="mt-2 max-w-md font-sans text-[13px] leading-relaxed text-[#6B4C35]/90">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex w-full min-w-0 flex-shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:max-w-[min(100%,520px)] lg:justify-end"
        >
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder={t('phonePlaceholder')}
            value={phone}
            onChange={onPhoneChange}
            disabled={saved}
            className="min-h-[42px] min-w-0 flex-1 rounded-lg border border-[#C0DD97] bg-white px-[14px] py-2.5 font-sans text-sm text-[#3D1F10] outline-none placeholder:text-[#6B4C35]/45 focus:border-accent focus:ring-1 focus:ring-accent/25 disabled:opacity-70"
            style={{ borderWidth: '0.5px' }}
            aria-invalid={error}
          />
          <div className="flex w-full min-w-0 flex-1 flex-col gap-1 sm:min-w-[160px] sm:flex-initial">
            <label
              htmlFor="callback-preferred-time"
              className="font-sans text-[11px] italic leading-tight text-[#6B4C35]/85"
            >
              {t('timeLabel')}
            </label>
            <select
              id="callback-preferred-time"
              value={preferred}
              onChange={(e) => setPreferred(e.target.value)}
              disabled={saved}
              className="min-h-[42px] w-full rounded-lg border border-[#C0DD97] bg-white px-3 py-2.5 font-sans text-sm text-[#3D1F10] outline-none focus:border-accent focus:ring-1 focus:ring-accent/25 disabled:opacity-70"
              style={{ borderWidth: '0.5px' }}
            >
              {PREFERRED_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {t(`time.${o.key}`)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting || saved}
            className={`min-h-[42px] shrink-0 rounded-lg px-5 py-2.5 font-sans text-sm font-medium transition disabled:cursor-not-allowed ${
              saved
                ? 'bg-[#EAF3DE] text-[#4A6B42] ring-1 ring-inset ring-accent/40'
                : 'bg-accent-dark text-white hover:brightness-95 disabled:opacity-60'
            }`}
          >
            {saved ? t('saved') : submitting ? '…' : t('submit')}
          </button>
        </form>
      </div>
      {error ? (
        <p className="mt-4 font-sans text-xs text-red-700">{t('error')}</p>
      ) : null}
    </div>
  );
}
