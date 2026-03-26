'use client';

import { SERVICE_SLUGS } from '@/lib/service-slugs';
import type { PortfolioItem } from '@/types';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PortfolioCard } from './PortfolioCard';

type FilterKey = 'all' | (typeof SERVICE_SLUGS)[number];

const FILTER_ORDER: FilterKey[] = ['all', ...SERVICE_SLUGS];

type Props = {
  initialItems: PortfolioItem[];
  locale: string;
};

function PortfolioEmptyIllustration() {
  return (
    <svg
      className="h-40 w-40 text-leaf/35"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
    >
      <path
        d="M100 175V45M100 120c-32-14-54-40-62-72M100 100c26-16 44-42 50-74M100 150c-20-8-34-24-40-44M100 140c16-6 28-18 36-34"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <path
        d="M48 88c-10 18-6 38 10 52 14-6 24-18 28-32-12-14-26-22-38-20z"
        fill="currentColor"
        opacity={0.22}
      />
      <path
        d="M152 64c-16 14-22 34-16 54 14 2 28-2 40-12-4-22-12-38-24-42z"
        fill="currentColor"
        opacity={0.18}
      />
    </svg>
  );
}

export function PortfolioGrid({ initialItems, locale }: Props) {
  const t = useTranslations('portfolio');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<FilterKey>('all');

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

  const setFilter = (key: FilterKey) => {
    setSelected(key);
    const params = new URLSearchParams(searchParams.toString());
    if (key === 'all') {
      params.delete('category');
    } else {
      params.set('category', key);
    }
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname);
  };

  const filtered = useMemo(() => {
    if (selected === 'all') {
      return initialItems;
    }
    return initialItems.filter((i) => i.category === selected);
  }, [initialItems, selected]);

  const categoryLabel = (slug: string | null) => {
    if (!slug || !(SERVICE_SLUGS as readonly string[]).includes(slug)) {
      return t('filters.uncategorized');
    }
    return t(`filters.categories.${slug}` as never);
  };

  return (
    <div className="text-brown-deep">
      <div
        className="-mx-1 flex gap-2 overflow-x-auto pb-3 pt-1 [scrollbar-width:thin]"
        role="tablist"
        aria-label={t('filters.aria')}
      >
        {FILTER_ORDER.map((key) => {
          const active = selected === key;
          const label =
            key === 'all'
              ? t('filters.all')
              : t(`filters.categories.${key}` as never);
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(key)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-terracotta text-cream'
                  : 'bg-beige text-brown-deep hover:bg-beige/90'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {initialItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center md:py-24">
          <PortfolioEmptyIllustration />
          <p className="mt-8 max-w-md font-serif text-xl leading-relaxed text-brown-deep md:text-2xl">
            {t('emptyState.title')}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-brown-deep/70 md:py-20">
          {t('filterEmpty')}
        </p>
      ) : (
        <div
          key={selected}
          className="portfolio-grid-fade columns-1 gap-x-6 sm:columns-2 lg:columns-3"
        >
          {filtered.map((item) => (
            <div key={item.id} className="mb-6 break-inside-avoid">
              <PortfolioCard
                item={item}
                locale={locale}
                categoryLabel={categoryLabel(item.category)}
                ctaLabel={t('card.cta')}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
