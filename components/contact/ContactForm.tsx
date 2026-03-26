'use client';

import { supabase } from '@/lib/supabase';
import { SERVICE_SLUGS } from '@/lib/service-slugs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export function ContactForm() {
  const t = useTranslations('contact');
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const subjects = useMemo(
    () => [...SERVICE_SLUGS, 'other'] as const,
    [],
  );

  useEffect(() => {
    const raw = searchParams.get('subject');
    if (!raw) return;
    if (!(subjects as readonly string[]).includes(raw)) return;
    setForm((prev) => ({ ...prev, subject: raw }));
  }, [searchParams, subjects]);

  const faqItems = useMemo(
    () => ['process', 'pricing', 'remote', 'team'] as const,
    [],
  );

  const handleChange =
    (key: keyof FormState) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');

    if (!validate()) {
      setStatus('error');
      return;
    }

    setLoading(true);
    const { error } = await (
      supabase as import('@supabase/supabase-js').SupabaseClient
    )
      .from('contacts')
      .insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        subject: form.subject || null,
        message: form.message.trim(),
        is_read: false,
      });
    setLoading(false);

    if (error) {
      setStatus('error');
      return;
    }

    setStatus('success');
    setForm(initialState);
  };

  return (
    <div className="space-y-14">
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          id="contact-form"
          onSubmit={onSubmit}
          className="rounded-3xl border border-beige bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-brown-deep">
                {t('form.name')}
              </span>
              <input
                required
                value={form.name}
                onChange={handleChange('name')}
                className="h-11 rounded-lg border border-beige bg-cream/50 px-3 text-sm outline-none ring-terracotta/30 transition focus:ring-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-brown-deep">
                {t('form.email')}
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange('email')}
                className="h-11 rounded-lg border border-beige bg-cream/50 px-3 text-sm outline-none ring-terracotta/30 transition focus:ring-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-brown-deep">
                {t('form.phone')}
              </span>
              <input
                value={form.phone}
                onChange={handleChange('phone')}
                className="h-11 rounded-lg border border-beige bg-cream/50 px-3 text-sm outline-none ring-terracotta/30 transition focus:ring-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-brown-deep">
                {t('form.subject')}
              </span>
              <select
                value={form.subject}
                onChange={handleChange('subject')}
                className="h-11 rounded-lg border border-beige bg-cream/50 px-3 text-sm outline-none ring-terracotta/30 transition focus:ring-2"
              >
                <option value="">{t('form.subjectPlaceholder')}</option>
                {subjects.map((key) => (
                  <option key={key} value={key}>
                    {t(`form.subjects.${key}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-brown-deep">
                {t('form.message')}
              </span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={handleChange('message')}
                className="rounded-lg border border-beige bg-cream/50 px-3 py-2.5 text-sm outline-none ring-terracotta/30 transition focus:ring-2"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-terracotta px-6 text-sm font-semibold text-cream transition hover:bg-terracotta-dark disabled:opacity-80"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/50 border-t-cream" />
                  {t('form.sending')}
                </>
              ) : (
                t('form.submit')
              )}
            </button>

            {status === 'success' ? (
              <p className="inline-flex items-center gap-2 text-sm text-green-700">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden
                >
                  <path d="M12 2c-2.5 3.2-5 5-7 7 1 4 4.5 8 7 13 2.5-5 6-9 7-13-2-2-4.5-3.8-7-7z" />
                </svg>
                {t('form.success')}
              </p>
            ) : null}

            {status === 'error' ? (
              <p className="text-sm text-terracotta">{t('form.error')}</p>
            ) : null}
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-beige bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-brown-deep/60">
              {t('info.emailLabel')}
            </p>
            <a
              href="mailto:info@toprakco.tr"
              className="mt-1 block text-base text-terracotta hover:underline"
            >
              info@toprakco.tr
            </a>
          </div>
          <div className="rounded-2xl border border-beige bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-brown-deep/60">
              {t('info.instagramLabel')}
            </p>
            <p className="mt-1 text-base text-brown-deep">@toprakandco</p>
          </div>
          <div className="rounded-2xl border border-beige bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-brown-deep/60">
              {t('info.youtubeLabel')}
            </p>
            <p className="mt-1 text-base text-brown-deep">Toprak &amp; Co.</p>
          </div>

          <div className="rounded-3xl border border-beige bg-beige/45 p-8">
            <svg
              viewBox="0 0 220 260"
              className="h-[320px] w-full text-leaf/70"
              aria-hidden
            >
              <path
                d="M110 245V105M110 160c-26-10-44-28-55-55M110 140c21-12 34-32 41-58M110 196c-16-7-28-18-34-34M110 184c14-6 24-16 30-30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M53 104c-8 16-5 32 8 44 11-4 19-12 23-22-6-11-16-18-31-22z"
                fill="currentColor"
                opacity="0.32"
              />
              <path
                d="M151 82c-13 12-18 28-14 46 12 1 23-2 33-10 0-13-6-25-19-36z"
                fill="currentColor"
                opacity="0.24"
              />
              <path
                d="M91 161c-8 10-10 22-4 34 9 0 16-3 23-8 0-10-4-18-12-26z"
                fill="currentColor"
                opacity="0.26"
              />
              <path
                d="M121 149c9 8 14 18 13 31-8 3-15 2-23-2-2-10 1-20 10-29z"
                fill="var(--terracotta)"
                opacity="0.24"
              />
            </svg>
          </div>
        </aside>
      </div>

      <section className="rounded-3xl border border-beige bg-beige/60 p-5 md:p-8">
        <h2 className="font-serif text-2xl text-brown-deep">{t('faq.title')}</h2>
        <div className="mt-4 divide-y divide-terracotta/15">
          {faqItems.map((key, i) => {
            const open = openFaq === i;
            return (
              <div key={key}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between py-4 text-left"
                >
                  <span className="text-sm font-medium text-brown-deep">
                    {t(`faq.items.${key}.q`)}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 text-terracotta transition-transform duration-300 ${
                      open ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'
                  }`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-brown-deep/75">
                    {t(`faq.items.${key}.a`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
