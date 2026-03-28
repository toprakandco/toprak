'use client';

import { Link } from '@/i18n/navigation';
import {
  type VoiceOverCategoryId,
  VOICE_OVER_CATEGORY_IDS,
} from '@/lib/voice-over-categories';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { type ComponentType, useState } from 'react';

const CATEGORIES: VoiceOverCategoryId[] = [...VOICE_OVER_CATEGORY_IDS];

function IconMegaphone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path
        d="M14 40V24l28-8v32L14 40z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        d="M14 28H8a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h6"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path
        d="M46 18c4 4 6 10 6 14s-2 10-6 14"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFilmReel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <rect
        x={10}
        y={14}
        width={44}
        height={36}
        rx={4}
        stroke="currentColor"
        strokeWidth={1.8}
      />
      <circle cx={22} cy={26} r={3} fill="currentColor" />
      <circle cx={32} cy={26} r={3} fill="currentColor" />
      <circle cx={42} cy={26} r={3} fill="currentColor" />
      <circle cx={22} cy={38} r={3} fill="currentColor" />
      <circle cx={32} cy={38} r={3} fill="currentColor" />
      <circle cx={42} cy={38} r={3} fill="currentColor" />
    </svg>
  );
}

function IconGradCap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path
        d="M8 28 32 16l24 12-24 12L8 28z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        d="M16 31v12c0 6 7 10 16 10s16-4 16-10V31"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path d="M44 35v8" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

function IconOpenBook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path
        d="M32 12v40"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path
        d="M12 18c8-4 12-4 20 0v34c-8-4-12-4-20 0V18z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        d="M52 18c-8-4-12-4-20 0v34c8-4 12-4 20 0V18z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGamepad({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <rect
        x={8}
        y={22}
        width={48}
        height={28}
        rx={8}
        stroke="currentColor"
        strokeWidth={1.8}
      />
      <path d="M20 34h6M23 31v6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={44} cy={34} r={2.5} fill="currentColor" />
      <circle cx={50} cy={30} r={2} fill="currentColor" />
    </svg>
  );
}

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <path
        d="M18 52V20h14v32H18zM36 52V28h14v24H36z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path d="M14 52h36" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M24 28v-8h6v8M42 36v-8h6v8" stroke="currentColor" strokeWidth={1.4} />
    </svg>
  );
}

const ICONS: Record<VoiceOverCategoryId, ComponentType<{ className?: string }>> = {
  reklam: IconMegaphone,
  'belgesel-haber': IconFilmReel,
  elearning: IconGradCap,
  kitap: IconOpenBook,
  'animasyon-oyun': IconGamepad,
  'kurumsal-ivr': IconBuilding,
};

const TIMELINES = ['urgent', 'normal', 'planning'] as const;
type TimelineId = (typeof TIMELINES)[number];

export function VoiceOverSelector() {
  const t = useTranslations('services.voiceSelector');
  const [category, setCategory] = useState<VoiceOverCategoryId | null>(null);
  const [timeline, setTimeline] = useState<TimelineId | null>(null);

  const categoryTitle = (id: VoiceOverCategoryId) => t(`categories.${id}.title`);

  const contactHref =
    category && timeline
      ? `/contact?subject=${encodeURIComponent('seslendirme')}&type=${encodeURIComponent(category)}`
      : '/contact';

  return (
    <section
      className="relative left-1/2 w-[100dvw] max-w-[100vw] -translate-x-1/2 bg-[#F5F0E6] py-16"
      aria-labelledby="voice-selector-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2
          id="voice-selector-heading"
          className="text-center font-serif text-[clamp(26px,4vw,40px)] text-[#3D1F10]"
        >
          {t('title')}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {CATEGORIES.map((id) => {
            const Icon = ICONS[id];
            const selected = category === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCategory(id);
                  setTimeline(null);
                }}
                className={`relative rounded-[12px] border bg-white p-5 text-left transition-[transform,border-color,background-color] duration-200 ${
                  selected
                    ? 'border-2 border-accent bg-[#FFF8F5]'
                    : 'border-[0.5px] border-[#EDE4D3] hover:-translate-y-[3px] hover:border-accent/55'
                } `}
              >
                {selected ? (
                  <span
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[#F5F0E6] shadow-sm"
                    aria-hidden
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}>
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : null}
                <div className="flex h-12 w-12 items-center justify-center text-accent">
                  <Icon className="h-10 w-10" />
                </div>
                <p className="mt-3 font-sans text-[15px] font-semibold text-[#3D1F10]">
                  {t(`categories.${id}.title`)}
                </p>
                <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-[#6B4C35]">
                  {t(`categories.${id}.desc`)}
                </p>
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {category ? (
            <motion.div
              key="step2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-12">
                <p className="text-center font-sans text-[17px] leading-relaxed text-[#3D1F10] md:text-[18px]">
                  {t('step2.question', { category: categoryTitle(category) })}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {TIMELINES.map((tid) => {
                    const active = timeline === tid;
                    return (
                      <button
                        key={tid}
                        type="button"
                        onClick={() => setTimeline(tid)}
                        className={`rounded-full px-5 py-2.5 font-sans text-[14px] transition ${
                          active
                            ? 'bg-accent text-[#F5F0E6] shadow-sm'
                            : 'border border-[#EDE4D3] bg-white text-[#3D1F10] hover:border-accent/55'
                        }`}
                      >
                        {t(`timelines.${tid}`)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {category && timeline ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mt-12"
            >
              <div className="rounded-2xl bg-accent px-6 py-8 text-center text-[#F5F0E6] md:px-10 md:py-10">
                <p className="font-serif text-[clamp(20px,3vw,26px)] leading-snug">
                  {t('cta.text')}
                </p>
                <Link
                  href={contactHref}
                  className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-[#F5F0E6] bg-transparent px-8 py-3 font-sans text-[15px] font-semibold text-[#F5F0E6] transition hover:bg-[#F5F0E6]/10"
                >
                  {t('cta.button')}
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
