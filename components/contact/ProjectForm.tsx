'use client';

import { Link } from '@/i18n/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

const SERVICE_IDS = [
  'grafik-tasarim',
  'ceviri',
  'seslendirme',
  'icerik-uretimi',
  'fotograf-video',
  'web-yazilim',
] as const;

type ServiceId = (typeof SERVICE_IDS)[number];

const BUDGET_IDS = [
  'lt-5k',
  '5-15k',
  '15-30k',
  '30k-plus',
  'prefer-not',
] as const;

const TIMELINE_IDS = [
  'urgent-1-3',
  '1-2-weeks',
  '1-month',
  'flexible',
] as const;

const PREF_IDS = ['email', 'whatsapp', 'video', 'any'] as const;

function buildWaDigits(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ??
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
    '';
  return raw.replace(/\D/g, '');
}

function slideVariants(reduce: boolean) {
  if (reduce) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  return {
    enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
  };
}

function ProgressSegments({ step }: { step: number }) {
  return (
    <div className="flex w-full max-w-md gap-2">
      {[0, 1, 2, 3].map((i) => {
        const filled = step > i;
        return (
          <div
            key={i}
            className="h-2 flex-1 overflow-hidden rounded-full bg-[#EDE4D3]"
          >
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={false}
              animate={{ width: filled ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        );
      })}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 7 + 13) % 100}%`,
        delay: `${(i % 8) * 0.04}s`,
        hue: (i * 47) % 360,
        size: 5 + (i % 4),
      })),
    [],
  );
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="project-confetti-piece absolute top-0 rounded-[2px] opacity-90"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: `hsl(${p.hue} 65% 52%)`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function CheckmarkIcon() {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 64 64"
      className="mx-auto h-16 w-16 text-[#7A9E6E]"
      aria-hidden
    >
      <motion.path
        d="M18 34l10 10 18-22"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
    </svg>
  );
}

export function ProjectForm() {
  const t = useTranslations('project.start');
  const reduceMotion = Boolean(useReducedMotion());
  const vars = useMemo(() => slideVariants(reduceMotion), [reduceMotion]);

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [services, setServices] = useState<ServiceId[]>([]);
  const [budget, setBudget] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [description, setDescription] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [contactPref, setContactPref] = useState<string>('');
  const [kvkk, setKvkk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleService = (id: ServiceId) => {
    setServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const goNext = useCallback(() => {
    setDir(1);
    setStep((s) => Math.min(4, s + 1));
  }, []);

  const goBack = useCallback(() => {
    setDir(-1);
    setStep((s) => Math.max(1, s - 1));
  }, []);

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/project-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services,
          budget,
          timeline,
          description,
          reference_url: referenceUrl.trim() || undefined,
          name,
          email,
          phone: phone.trim() || undefined,
          company: company.trim() || undefined,
          contact_preference: contactPref,
          kvkk: true,
        }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        setError(t('errors.submit'));
        return;
      }
      setSuccess(true);
    } catch {
      setError(t('errors.submit'));
    } finally {
      setSubmitting(false);
    }
  };

  const waDigits = buildWaDigits();
  const waHref =
    waDigits.length > 0
      ? `https://wa.me/${waDigits}?text=${encodeURIComponent('Merhaba, proje başvurum hakkında yazıyorum.')}`
      : null;

  if (success) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#EDE4D3] bg-white px-6 py-14 text-center shadow-sm md:px-10">
        {!reduceMotion ? <Confetti /> : null}
        <div className="relative z-[1] mx-auto max-w-md">
          <CheckmarkIcon />
          <h2 className="mt-6 font-serif text-2xl text-[#3D1F10] md:text-[28px]">
            {t('success.title')}
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#6B4C35]">
            {t('success.subtitle')}
          </p>
          <p className="mt-8 font-sans text-xs font-medium uppercase tracking-wider text-accent">
            {t('success.help')}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#25D366] px-6 py-2.5 font-sans text-sm font-medium text-white shadow-sm transition hover:brightness-95"
              >
                {t('success.whatsapp')}
              </a>
            ) : null}
            <a
              href="mailto:info@toprakco.tr"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-accent bg-transparent px-6 py-2.5 font-sans text-sm font-medium text-accent transition hover:bg-accent/5"
            >
              {t('success.emailUs')}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const stepLabels = [
    t('steps.service'),
    t('steps.budget'),
    t('steps.details'),
    t('steps.contact'),
  ];

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <ProgressSegments step={step} />
        <div className="mt-3 flex max-w-md justify-between gap-1 font-sans text-[11px] text-[#6B4C35]/80">
          {stepLabels.map((label, i) => (
            <span
              key={label}
              className={
                step === i + 1 ? 'font-semibold text-accent' : ''
              }
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="relative min-h-[320px] overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {step === 1 ? (
            <motion.div
              key="s1"
              custom={dir}
              variants={vars}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <h2 className="font-serif text-2xl text-[#3D1F10] md:text-[26px]">
                {t('step1.heading')}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SERVICE_IDS.map((id) => {
                  const sel = services.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleService(id)}
                      className={`flex min-h-[52px] items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left font-sans text-sm transition ${
                        sel
                          ? 'border-accent bg-[#FFF8F5] text-[#3D1F10]'
                          : 'border-[#EDE4D3] bg-white text-[#3D1F10] hover:border-accent/40'
                      }`}
                    >
                      <span>{t(`services.${id}`)}</span>
                      {sel ? (
                        <span className="text-accent" aria-hidden>
                          ✓
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={services.length === 0}
                  onClick={goNext}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-8 py-2.5 font-sans text-sm font-medium text-cream transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('step1.continue')}
                </button>
              </div>
            </motion.div>
          ) : null}

          {step === 2 ? (
            <motion.div
              key="s2"
              custom={dir}
              variants={vars}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <h2 className="font-serif text-2xl text-[#3D1F10] md:text-[26px]">
                {t('step2.heading')}
              </h2>
              <div>
                <p className="mb-2 font-sans text-xs font-medium uppercase tracking-wide text-[#6B4C35]">
                  {t('step2.budgetLabel')}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {BUDGET_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setBudget(id)}
                      className={`rounded-full border px-4 py-2 font-sans text-xs transition ${
                        budget === id
                          ? 'border-accent bg-[#FFF8F5] text-[#3D1F10]'
                          : 'border-[#EDE4D3] bg-white text-[#3D1F10] hover:border-accent/35'
                      }`}
                    >
                      {t(`budget.${id}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-sans text-xs font-medium uppercase tracking-wide text-[#6B4C35]">
                  {t('step2.timelineLabel')}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {TIMELINE_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTimeline(id)}
                      className={`rounded-full border px-4 py-2 font-sans text-xs transition ${
                        timeline === id
                          ? 'border-accent bg-[#FFF8F5] text-[#3D1F10]'
                          : 'border-[#EDE4D3] bg-white text-[#3D1F10] hover:border-accent/35'
                      }`}
                    >
                      {t(`timeline.${id}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#EDE4D3] bg-white px-6 font-sans text-sm text-[#3D1F10] transition hover:bg-[#F8F7F4]"
                >
                  {t('step2.back')}
                </button>
                <button
                  type="button"
                  disabled={!budget || !timeline}
                  onClick={goNext}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-8 py-2.5 font-sans text-sm font-medium text-cream transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('step2.continue')}
                </button>
              </div>
            </motion.div>
          ) : null}

          {step === 3 ? (
            <motion.div
              key="s3"
              custom={dir}
              variants={vars}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <h2 className="font-serif text-2xl text-[#3D1F10] md:text-[26px]">
                {t('step3.heading')}
              </h2>
              <p className="font-sans text-sm text-[#6B4C35]">{t('step3.hint')}</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 800))}
                rows={6}
                className="min-h-[160px] w-full resize-y rounded-xl border border-[#EDE4D3] bg-white px-4 py-3 font-sans text-sm text-[#3D1F10] outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                placeholder=""
              />
              <p className="text-right font-sans text-xs text-[#6B4C35]/70">
                {description.length}/800
              </p>
              <label className="block space-y-1">
                <span className="font-sans text-xs font-medium text-[#6B4C35]">
                  {t('step3.referenceLabel')}
                </span>
                <input
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder={t('step3.referencePlaceholder')}
                  className="h-11 w-full rounded-lg border border-[#EDE4D3] px-3 font-sans text-sm text-[#3D1F10] outline-none focus:border-accent"
                />
              </label>
              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#EDE4D3] bg-white px-6 font-sans text-sm text-[#3D1F10] transition hover:bg-[#F8F7F4]"
                >
                  {t('step3.back')}
                </button>
                <button
                  type="button"
                  disabled={description.trim().length < 1}
                  onClick={goNext}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-8 py-2.5 font-sans text-sm font-medium text-cream transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('step3.continue')}
                </button>
              </div>
            </motion.div>
          ) : null}

          {step === 4 ? (
            <motion.div
              key="s4"
              custom={dir}
              variants={vars}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <h2 className="font-serif text-2xl text-[#3D1F10] md:text-[26px]">
                {t('step4.heading')}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="font-sans text-xs text-[#6B4C35]">
                    {t('step4.name')} *
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#EDE4D3] px-3 font-sans text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-sans text-xs text-[#6B4C35]">
                    {t('step4.email')} *
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#EDE4D3] px-3 font-sans text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-sans text-xs text-[#6B4C35]">
                    {t('step4.phone')}
                  </span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#EDE4D3] px-3 font-sans text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="space-y-1">
                  <span className="font-sans text-xs text-[#6B4C35]">
                    {t('step4.company')}{' '}
                    <span className="text-[#6B4C35]/60">
                      ({t('step4.companyOptional')})
                    </span>
                  </span>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="h-11 w-full rounded-lg border border-[#EDE4D3] px-3 font-sans text-sm outline-none focus:border-accent"
                  />
                </label>
              </div>
              <div>
                <p className="mb-2 font-sans text-xs font-medium text-[#6B4C35]">
                  {t('step4.preferenceLabel')}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {PREF_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setContactPref(id)}
                      className={`rounded-full border px-4 py-2 font-sans text-xs transition ${
                        contactPref === id
                          ? 'border-accent bg-[#FFF8F5] text-[#3D1F10]'
                          : 'border-[#EDE4D3] bg-white text-[#3D1F10] hover:border-accent/35'
                      }`}
                    >
                      {t(`contactPref.${id}`)}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#EDE4D3] bg-[#FDFCF9] p-4">
                <input
                  type="checkbox"
                  checked={kvkk}
                  onChange={(e) => setKvkk(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#EDE4D3] text-accent focus:ring-accent"
                />
                <span className="font-sans text-sm leading-relaxed text-[#3D1F10]">
                  {t('step4.kvkkBefore')}
                  <Link href="/kvkk" className="font-medium text-accent underline underline-offset-2">
                    {t('step4.kvkkLink')}
                  </Link>
                  {t('step4.kvkkAfter')}
                </span>
              </label>
              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#EDE4D3] bg-white px-6 font-sans text-sm text-[#3D1F10] transition hover:bg-[#F8F7F4]"
                >
                  {t('step4.back')}
                </button>
                <button
                  type="button"
                  disabled={
                    submitting ||
                    !name.trim() ||
                    !email.trim() ||
                    !contactPref ||
                    !kvkk
                  }
                  onClick={onSubmit}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-8 py-2.5 font-sans text-sm font-medium text-cream transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? t('step4.sending') : t('step4.submit')}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
