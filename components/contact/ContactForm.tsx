'use client';

import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase-browser';
import { SERVICE_SLUGS } from '@/lib/service-slugs';
import { isVoiceOverCategoryId } from '@/lib/voice-over-categories';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const MESSAGE_MAX = 500;
const BTN_LOAD_PX = 56;

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  budget: string;
  privacyAccepted: boolean;
};

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  budget: '',
  privacyAccepted: false,
};

type FieldErrorKey = 'name' | 'email' | 'message';

const BUDGET_OPTIONS = [
  { value: 'lt-5k', labelKey: 'lt5k' },
  { value: '5-15k', labelKey: '5to15k' },
  { value: '15-30k', labelKey: '15to30k' },
  { value: '30k-plus', labelKey: '30kPlus' },
  { value: 'prefer-not', labelKey: 'preferNot' },
] as const;

function emailValid(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function phoneOk(s: string) {
  const t = s.trim();
  if (!t) return true;
  return /^[\d\s+().-]{7,}$/.test(t);
}

function FieldCheck({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className="mb-3 h-[18px] w-[18px] shrink-0 text-[#7A9E6E]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function SuccessLeaf({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M60 8C38 28 22 52 18 78c-4 26 8 48 32 58 12-18 18-38 20-58 2-22-2-44-10-70z"
        fill="#7A9E6E"
        fillOpacity="0.2"
      />
      <path
        d="M60 12c-16 22-26 46-24 72 2 20 14 36 28 44M56 24c10 8 18 20 22 36"
        stroke="#7A9E6E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M60 118v22"
        stroke="#7A9E6E"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

function FloatInput({
  id,
  label,
  value,
  onChange,
  onBlurField,
  error,
  showCheck,
  type = 'text',
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlurField: () => void;
  error?: string;
  showCheck: boolean;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div>
      <div className="flex items-end gap-2 border-b-[1.5px] border-[#EDE4D3] transition-[border-color] duration-200 focus-within:border-accent">
        <div className="relative min-w-0 flex-1">
          <label
            htmlFor={id}
            className={`pointer-events-none absolute left-0 z-[1] origin-left font-sans transition-all duration-200 ease-out ${
              floated
                ? 'top-0 -translate-y-[calc(100%-2px)] text-[11px] font-medium not-italic text-accent'
                : 'top-[14px] translate-y-0 text-[15px] italic text-[#C4B5A8]'
            }`}
          >
            {label}
            {required ? '*' : ''}
          </label>
          <input
            id={id}
            type={type}
            name={id}
            autoComplete={autoComplete}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onBlurField();
            }}
            className="w-full border-0 bg-transparent py-[14px] font-sans text-[15px] text-[#3D1F10] outline-none transition-[border-color] duration-200 placeholder:font-sans placeholder:text-[15px] placeholder:italic placeholder:text-[#C4B5A8]"
            placeholder={floated ? '' : ' '}
          />
        </div>
        <FieldCheck show={showCheck} />
      </div>
      {error ? (
        <p className="mt-1 font-sans text-[12px] text-accent">{error}</p>
      ) : null}
    </div>
  );
}

function FloatSelect({
  id,
  label,
  value,
  onChange,
  onBlurField,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlurField: () => void;
  children: ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div>
      <div className="relative flex items-end gap-2 border-b-[1.5px] border-[#EDE4D3] transition-[border-color] duration-200 focus-within:border-accent">
        <div className="relative min-w-0 flex-1">
          <label
            htmlFor={id}
            className={`pointer-events-none absolute left-0 z-[1] origin-left font-sans transition-all duration-200 ease-out ${
              floated
                ? 'top-0 -translate-y-[calc(100%-2px)] text-[11px] font-medium not-italic text-accent'
                : 'top-[14px] translate-y-0 text-[15px] italic text-[#C4B5A8]'
            }`}
          >
            {label}
          </label>
          <select
            id={id}
            name={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onBlurField();
            }}
            className="w-full cursor-pointer appearance-none border-0 bg-transparent py-[14px] pr-8 font-sans text-[15px] text-[#3D1F10] outline-none transition-[border-color] duration-200"
          >
            {children}
          </select>
          <svg
            className="pointer-events-none absolute right-0 bottom-[18px] h-4 w-4 text-[#C4B5A8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <FieldCheck show={floated && Boolean(value)} />
      </div>
    </div>
  );
}

function FloatTextarea({
  id,
  label,
  value,
  onChange,
  onBlurField,
  error,
  showCheck,
  required,
  charLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlurField: () => void;
  error?: string;
  showCheck: boolean;
  required?: boolean;
  charLabel: string;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div>
      <div className="relative flex gap-2 border-b-[1.5px] border-[#EDE4D3] transition-[border-color] duration-200 focus-within:border-accent">
        <div className="relative min-h-[140px] min-w-0 flex-1 pb-7">
          <label
            htmlFor={id}
            className={`pointer-events-none absolute left-0 z-[1] origin-left font-sans transition-all duration-200 ease-out ${
              floated
                ? 'top-0 text-[11px] font-medium not-italic text-accent'
                : 'top-[14px] text-[15px] italic text-[#C4B5A8]'
            }`}
          >
            {label}
            {required ? '*' : ''}
          </label>
          <textarea
            id={id}
            name={id}
            value={value}
            maxLength={MESSAGE_MAX}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onBlurField();
            }}
            className="mt-8 min-h-[108px] w-full resize-y border-0 bg-transparent font-sans text-[15px] leading-relaxed text-[#3D1F10] outline-none transition-[border-color] duration-200 placeholder:italic placeholder:text-[#C4B5A8]"
            placeholder={floated ? '' : ' '}
          />
          <span className="pointer-events-none absolute bottom-0 right-0 font-sans text-[12px] text-[#C4B5A8]">
            {charLabel}
          </span>
        </div>
        <div className="flex flex-col justify-start pt-8">
          <FieldCheck show={showCheck} />
        </div>
      </div>
      {error ? (
        <p className="mt-1 font-sans text-[12px] text-accent">{error}</p>
      ) : null}
    </div>
  );
}

function ButtonCheckDrawing() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-[#F5F0E6]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <motion.path
        d="M6 12l4 4 8-8"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

export function ContactForm() {
  const t = useTranslations('contact');
  const tVoice = useTranslations('services.voiceSelector');
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [form, setForm] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Partial<Record<FieldErrorKey, boolean>>>(
    {},
  );
  const [errors, setErrors] = useState<Partial<Record<FieldErrorKey, string>>>(
    {},
  );
  const [phoneTouched, setPhoneTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [buttonSuccess, setButtonSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [view, setView] = useState<'form' | 'thanks'>('form');
  const subjects = useMemo(
    () => [...SERVICE_SLUGS, 'other'] as const,
    [],
  );

  useEffect(() => {
    const rawSubject = searchParams.get('subject');
    const rawType = searchParams.get('type');
    if (!rawSubject || !(subjects as readonly string[]).includes(rawSubject)) {
      return;
    }
    let prefillLine = '';
    if (
      rawSubject === 'seslendirme' &&
      rawType &&
      isVoiceOverCategoryId(rawType)
    ) {
      const categoryLabel = tVoice(`categories.${rawType}.title`);
      prefillLine = tVoice('prefillMessage', { category: categoryLabel });
    }
    setForm((prev) => {
      const next = { ...prev, subject: rawSubject };
      if (!prefillLine) return next;
      const msg = prev.message.trim();
      if (msg.includes(prefillLine)) return next;
      return {
        ...next,
        message: msg ? `${prefillLine}\n\n${msg}` : prefillLine,
      };
    });
  }, [searchParams, subjects, tVoice]);

  const validateName = useCallback(
    (v: string) => (!v.trim() ? t('form.validation.name') : undefined),
    [t],
  );
  const validateEmail = useCallback(
    (v: string) => (!emailValid(v) ? t('form.validation.email') : undefined),
    [t],
  );
  const validateMessage = useCallback(
    (v: string) => {
      const x = v.trim();
      if (!x) return t('form.validation.message');
      if (x.length > MESSAGE_MAX) return t('form.validation.message');
      return undefined;
    },
    [t],
  );

  const blurName = useCallback(() => {
    setTouched((s) => ({ ...s, name: true }));
    setErrors((e) => ({ ...e, name: validateName(form.name) }));
  }, [form.name, validateName]);

  const blurEmail = useCallback(() => {
    setTouched((s) => ({ ...s, email: true }));
    setErrors((e) => ({ ...e, email: validateEmail(form.email) }));
  }, [form.email, validateEmail]);

  const blurMessage = useCallback(() => {
    setTouched((s) => ({ ...s, message: true }));
    setErrors((e) => ({ ...e, message: validateMessage(form.message) }));
  }, [form.message, validateMessage]);

  const blurPhone = useCallback(() => {
    setPhoneTouched(true);
  }, []);

  const blurSubject = useCallback(() => {}, []);

  useEffect(() => {
    if (touched.name) {
      setErrors((e) => ({ ...e, name: validateName(form.name) }));
    }
  }, [form.name, touched.name, validateName]);

  useEffect(() => {
    if (touched.email) {
      setErrors((e) => ({ ...e, email: validateEmail(form.email) }));
    }
  }, [form.email, touched.email, validateEmail]);

  useEffect(() => {
    if (touched.message) {
      setErrors((e) => ({ ...e, message: validateMessage(form.message) }));
    }
  }, [form.message, touched.message, validateMessage]);

  const showNameCheck =
    Boolean(touched.name) && !errors.name && form.name.trim().length > 0;
  const showEmailCheck =
    Boolean(touched.email) && !errors.email && emailValid(form.email);
  const showMessageCheck =
    Boolean(touched.message) &&
    !errors.message &&
    form.message.trim().length > 0 &&
    form.message.length <= MESSAGE_MAX;
  const showPhoneCheck = phoneTouched && phoneOk(form.phone);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(false);
    setTouched({ name: true, email: true, message: true });
    setPhoneTouched(true);

    const nextErrors: Partial<Record<FieldErrorKey, string>> = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      message: validateMessage(form.message),
    };
    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.email || nextErrors.message) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }

    if (!phoneOk(form.phone)) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }

    if (!form.privacyAccepted) {
      setPrivacyError(true);
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }
    setPrivacyError(false);

    setLoading(true);
    const budgetVal = form.budget.trim() || null;

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
        budget: budgetVal,
        is_read: false,
      });

    setLoading(false);

    if (error) {
      setSubmitError(true);
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      return;
    }

    setButtonSuccess(true);
    window.setTimeout(() => {
      setButtonSuccess(false);
      setForm(initialState);
      setTouched({});
      setErrors({});
      setPhoneTouched(false);
      setPrivacyError(false);
      setView('thanks');
    }, reduceMotion ? 400 : 900);
  };

  const charLabel = t('form.charCount', { current: form.message.length });

  return (
    <>
      <section
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-white py-20"
        aria-labelledby={
          view === 'thanks' ? 'contact-success-heading' : 'contact-form-heading'
        }
      >
        <div className="mx-auto w-full max-w-[720px] px-[max(24px,5vw)]">
          <AnimatePresence mode="wait">
            {view === 'thanks' ? (
              <motion.div
                key="thanks"
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[24px] text-center shadow-[0_8px_48px_rgba(0,0,0,0.06)]"
                style={{ padding: '48px' }}
              >
                <SuccessLeaf className="mx-auto mb-6 h-32 w-auto" />
                <p
                  id="contact-success-heading"
                  className="font-serif text-2xl text-[#3D1F10]"
                  style={{ fontSize: '24px' }}
                >
                  {t('form.successTitle')}
                </p>
                <p className="mx-auto mt-3 max-w-md font-sans text-[15px] leading-relaxed text-[#6B4C35]">
                  {t('form.successSubtitle')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-[24px] shadow-[0_8px_48px_rgba(0,0,0,0.06)]"
                style={{ padding: '48px' }}
              >
                <header className="mb-10 text-center">
                  <h2
                    id="contact-form-heading"
                    className="font-serif text-[28px] text-[#3D1F10]"
                  >
                    {t('form.sectionTitle')}
                  </h2>
                  <p className="mx-auto mt-2 max-w-md font-sans text-[15px] text-[#6B4C35]/85">
                    {t('form.sectionSubtitle')}
                  </p>
                </header>

                <form id="contact-form" onSubmit={onSubmit} noValidate>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2">
                    <FloatInput
                      id="contact-name"
                      label={t('form.name')}
                      value={form.name}
                      onChange={(v) => setForm((s) => ({ ...s, name: v }))}
                      onBlurField={blurName}
                      error={touched.name ? errors.name : undefined}
                      showCheck={showNameCheck}
                      required
                      autoComplete="name"
                    />
                    <FloatInput
                      id="contact-email"
                      label={t('form.email')}
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                      onBlurField={blurEmail}
                      error={touched.email ? errors.email : undefined}
                      showCheck={showEmailCheck}
                      required
                      autoComplete="email"
                    />
                    <FloatInput
                      id="contact-phone"
                      label={t('form.phone')}
                      type="tel"
                      value={form.phone}
                      onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
                      onBlurField={blurPhone}
                      error={
                        phoneTouched && !phoneOk(form.phone)
                          ? t('form.validation.phone')
                          : undefined
                      }
                      showCheck={showPhoneCheck}
                      autoComplete="tel"
                    />
                    <FloatSelect
                      id="contact-subject"
                      label={t('form.subject')}
                      value={form.subject}
                      onChange={(v) => setForm((s) => ({ ...s, subject: v }))}
                      onBlurField={blurSubject}
                    >
                      <option value="">{t('form.subjectPlaceholder')}</option>
                      {subjects.map((key) => (
                        <option key={key} value={key}>
                          {t(`form.subjects.${key}`)}
                        </option>
                      ))}
                    </FloatSelect>
                  </div>

                  <div className="mt-8">
                    <FloatTextarea
                      id="contact-message"
                      label={t('form.message')}
                      value={form.message}
                      onChange={(v) => setForm((s) => ({ ...s, message: v }))}
                      onBlurField={blurMessage}
                      error={touched.message ? errors.message : undefined}
                      showCheck={showMessageCheck}
                      required
                      charLabel={charLabel}
                    />
                  </div>

                  <div className="mt-10">
                    <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3D1F10]/55">
                      {t('form.budgetLabel')}
                      <span className="ml-2 font-normal normal-case tracking-normal text-[#C4B5A8]">
                        ({t('form.budgetOptional')})
                      </span>
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                      {BUDGET_OPTIONS.map(({ value: val, labelKey }) => (
                        <label
                          key={val}
                          className={`cursor-pointer rounded-full px-4 py-2.5 font-sans text-[14px] transition-colors duration-200 ${
                            form.budget === val
                              ? 'bg-accent text-[#F5F0E6]'
                              : 'bg-[#EDE4D3]/80 text-[#3D1F10] hover:bg-[#EDE4D3]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="budget"
                            value={val}
                            checked={form.budget === val}
                            onChange={() =>
                              setForm((s) => ({ ...s, budget: val }))
                            }
                            className="sr-only"
                          />
                          {t(`form.budget.${labelKey}`)}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <label className="flex cursor-pointer items-start gap-3 text-left font-sans text-[14px] leading-snug text-[#3D1F10]">
                      <input
                        type="checkbox"
                        name="privacy"
                        checked={form.privacyAccepted}
                        onChange={(e) => {
                          setForm((s) => ({
                            ...s,
                            privacyAccepted: e.target.checked,
                          }));
                          setPrivacyError(false);
                        }}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-[#EDE4D3] text-accent focus:ring-2 focus:ring-accent/30"
                        required
                        aria-invalid={privacyError}
                        aria-describedby={
                          privacyError ? 'contact-privacy-error' : undefined
                        }
                      />
                      <span>
                        {t('form.privacyConsentBefore')}
                        <Link
                          href="/kvkk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-accent underline underline-offset-2 transition hover:text-accent-dark"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t('form.privacyConsentLink')}
                        </Link>
                        {t('form.privacyConsentAfter')}
                      </span>
                    </label>
                    {privacyError ? (
                      <p
                        id="contact-privacy-error"
                        className="mt-2 font-sans text-[12px] text-accent"
                        role="alert"
                      >
                        {t('form.validation.privacy')}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-10">
                    <motion.button
                      type="submit"
                      disabled={loading || buttonSuccess}
                      animate={{
                        width: loading ? BTN_LOAD_PX : '100%',
                        maxWidth: '100%',
                        marginLeft: loading ? 'auto' : 0,
                        marginRight: loading ? 'auto' : 0,
                        backgroundColor: buttonSuccess
                          ? '#7A9E6E'
                          : 'var(--accent-color)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 34,
                      }}
                      className={`flex h-14 max-w-full items-center justify-center overflow-hidden rounded-[50px] font-serif text-[17px] text-[#F5F0E6] shadow-none outline-none transition-colors disabled:opacity-90 ${
                        shake ? 'animate-contact-form-shake' : ''
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {loading ? (
                          <motion.span
                            key="load"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#F5F0E6]/25 border-t-[#F5F0E6]"
                          />
                        ) : buttonSuccess ? (
                          <motion.span
                            key="ok"
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center"
                          >
                            <ButtonCheckDrawing />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="txt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="whitespace-nowrap px-6"
                          >
                            {t('form.submit')}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {submitError ? (
                      <p className="mt-3 text-center font-sans text-[14px] text-accent">
                        {t('form.error')}
                      </p>
                    ) : null}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
