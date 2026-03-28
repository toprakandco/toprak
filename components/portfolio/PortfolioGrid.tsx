'use client';

import { SERVICE_SLUGS } from '@/lib/service-slugs';
import type { PortfolioItem } from '@/types';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PortfolioCard } from './PortfolioCard';

type FilterKey = 'all' | (typeof SERVICE_SLUGS)[number];

const FILTER_ORDER: FilterKey[] = ['all', ...SERVICE_SLUGS];

type Props = {
  initialItems: PortfolioItem[];
  locale: string;
};

export function PortfolioGrid({ initialItems, locale }: Props) {
  void locale;
  const t = useTranslations('portfolio');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<FilterKey>('all');
  const [phase, setPhase] = useState<'visible' | 'hiding'>('visible');
  const [displayed, setDisplayed] = useState<PortfolioItem[]>(initialItems);

  useEffect(() => {
    const raw = searchParams.get('category');
    if (!raw) {
      setSelected('all');
      return;
    }
    if ((SERVICE_SLUGS as readonly string[]).includes(raw)) {
      setSelected(raw as FilterKey);
    }
  }, [searchParams]);

  const applyFilter = (key: FilterKey) => {
    const nextItems =
      key === 'all'
        ? initialItems
        : initialItems.filter((item) => item.category === key);

    setSelected(key);
    const params = new URLSearchParams(searchParams.toString());
    if (key === 'all') {
      params.delete('category');
    } else {
      params.set('category', key);
    }
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);

    if (reduceMotion) {
      setDisplayed(nextItems);
      setPhase('visible');
      return;
    }

    setPhase('hiding');
    window.setTimeout(() => {
      setDisplayed(nextItems);
      setPhase('visible');
    }, 150);
  };

  useEffect(() => {
    const raw = searchParams.get('category');
    const key =
      raw && (SERVICE_SLUGS as readonly string[]).includes(raw)
        ? (raw as FilterKey)
        : 'all';
    const nextItems =
      key === 'all'
        ? initialItems
        : initialItems.filter((item) => item.category === key);
    setSelected(key);
    setDisplayed(nextItems);
    setPhase('visible');
  }, [searchParams, initialItems]);

  const labels = useMemo(
    () => ({
      all: t('filters.all'),
      uncategorized: t('filters.uncategorized'),
      categories: SERVICE_SLUGS.reduce<Record<string, string>>((acc, slug) => {
        acc[slug] = t(`filters.categories.${slug}` as never);
        return acc;
      }, {}),
    }),
    [t],
  );

  const categoryLabel = (slug: string | null) =>
    !slug || !(SERVICE_SLUGS as readonly string[]).includes(slug)
      ? labels.uncategorized
      : labels.categories[slug];

  return (
    <div className="text-brown-deep">
      <div
        className="sticky top-[var(--navbar-height)] z-30 -mx-6 mb-8 border-y border-[#EDE4D3] bg-[rgba(245,240,230,0.92)] px-6 py-3 backdrop-blur-xl [-webkit-backdrop-filter:blur(12px)] [backdrop-filter:blur(12px)] md:-mx-[max(24px,5vw)] md:px-[max(24px,5vw)]"
        role="tablist"
        aria-label={t('filters.aria')}
      >
        <div className="scroll-touch-x flex gap-2">
          {FILTER_ORDER.map((key) => {
            const active = selected === key;
            const label =
              key === 'all' ? labels.all : labels.categories[key];
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => applyFilter(key)}
                className={`min-h-[44px] shrink-0 rounded-full border px-4 py-2 text-sm transition-all duration-250 ${
                  active
                    ? 'border-accent bg-accent text-cream shadow-[0_4px_12px_rgba(139,58,30,0.2)]'
                    : 'border-[#EDE4D3] bg-white text-[#6B4C35] hover:bg-[#F8F4EC]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {initialItems.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center py-16 text-center">
          <svg
            className="portfolio-empty-float h-[120px] w-[120px] text-leaf/30"
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden
          >
            <path
              d="M60 102V28M60 46c-14-9-22-23-21-38 12 4 19 14 21 28M60 48c14-9 22-23 21-38-12 4-19 14-21 28"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M35 58c-8 11-5 24 7 32 9-4 15-11 18-21-8-9-16-13-25-11zM85 54c-10 8-14 19-10 31 9 1 17-2 24-8-3-12-8-21-14-23z"
              fill="currentColor"
              opacity="0.24"
            />
          </svg>
          <p className="mt-8 font-serif text-[24px] text-[#3D1F10]">
            {t('emptyState.title')}
          </p>
          <p className="mt-3 text-[14px] text-[#6B4C35]/75">{t('emptyState.subtitle')}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full border border-accent px-6 py-2 text-sm text-accent transition hover:bg-accent hover:text-cream"
          >
            {t('emptyState.cta')}
          </Link>
        </div>
      ) : displayed.length === 0 ? (
        <p className="py-16 text-center text-brown-deep/70 md:py-20">
          {t('filterEmpty')}
        </p>
      ) : (
        <motion.div
          animate={
            phase === 'hiding' ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }
          }
          transition={{ duration: reduceMotion ? 0 : 0.15, ease: 'easeOut' }}
          className="columns-1 gap-x-5 md:columns-2 xl:columns-3"
        >
          <AnimatePresence mode="popLayout">
            {displayed.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                exit={reduceMotion ? {} : { opacity: 0, scale: 0.96 }}
                transition={{ duration: reduceMotion ? 0 : 0.6, delay: i * 0.08, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.2 }}
                className="mb-5 break-inside-avoid"
              >
                <PortfolioCard
                  item={item}
                  locale={locale}
                  index={i}
                  categoryLabel={categoryLabel(item.category)}
                  ctaLabel={t('card.cta')}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
