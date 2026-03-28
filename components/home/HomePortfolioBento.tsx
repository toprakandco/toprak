'use client';

import { BeforeAfterSlider } from '@/components/portfolio/BeforeAfterSlider';
import { ServiceOrganicIcon } from '@/components/services/ServiceOrganicIcon';
import { Link, useRouter } from '@/i18n/navigation';
import { isServiceSlug } from '@/lib/service-slugs';
import type { PortfolioItem } from '@/types';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

type Props = {
  title: string;
  overline: string;
  seeAll: string;
  viewProject: string;
  items: PortfolioItem[];
  categoryFallback: string;
};

const GRID = [
  'md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-1',
  'md:col-start-3 md:row-start-1',
  'md:col-start-4 md:row-start-1',
  'md:col-start-3 md:row-start-2',
  'md:col-start-4 md:row-start-2',
] as const;

function PlaceholderCard() {
  return (
    <div className="flex h-full min-h-[160px] items-center justify-center rounded-2xl border border-beige bg-beige/60 p-6">
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-terracotta/25" fill="none" aria-hidden>
        <path
          d="M12 48L28 20l10 16 8-8 16 20H12z"
          stroke="currentColor"
          strokeWidth={1.2}
        />
      </svg>
    </div>
  );
}

export function HomePortfolioBento({
  title,
  overline,
  seeAll,
  viewProject,
  items,
  categoryFallback,
}: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const locale = useLocale();
  const tCard = useTranslations('home.servicesCards');
  const list = [...items].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
  const five = Array.from({ length: 5 }, (_, i) => list[i] ?? null);

  const getTitle = (item: PortfolioItem) =>
    locale === 'tr' ? item.title_tr : item.title_en;

  const categoryName = (item: PortfolioItem) => {
    const c = item.category;
    if (c && isServiceSlug(c)) {
      return tCard(`${c}.title` as never);
    }
    return categoryFallback;
  };

  return (
    <section className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 bg-white py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-[max(24px,5vw)]">
        <p className="text-center text-xs font-medium uppercase tracking-[0.35em] text-terracotta">
          {overline}
        </p>
        <h2 className="mt-4 text-center font-serif text-[clamp(24px,4vw,48px)] text-brown-deep">{title}</h2>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          {five.map((item, idx) => {
            const pos = GRID[idx] ?? '';
            if (!item) {
              return (
                <div key={`ph-${idx}`} className={`${pos} min-h-[140px]`}>
                  <PlaceholderCard />
                </div>
              );
            }

            const titleText = getTitle(item);
            const cat = categoryName(item);
            const large = idx === 0;
            const hasBA = Boolean(item.before_image && item.after_image);

            const shellClass = `relative w-full overflow-hidden bg-beige ${
              large ? 'min-h-[200px] md:aspect-auto md:h-full md:min-h-[360px]' : 'aspect-[4/3]'
            }`;
            const cardClass =
              'relative block h-full overflow-hidden rounded-2xl border border-beige bg-beige shadow-sm ring-1 ring-beige/80';

            const cardBody = (
              <div className={shellClass}>
                {hasBA ? (
                  <BeforeAfterSlider
                    beforeImage={item.before_image!}
                    afterImage={item.after_image!}
                    title={titleText}
                    className={
                      large
                        ? 'absolute inset-0 h-full min-h-[200px] w-full md:min-h-[360px]'
                        : 'absolute inset-0 h-full w-full'
                    }
                  />
                ) : item.cover_image ? (
                  <Image
                    src={item.cover_image}
                    alt={titleText}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full min-h-[inherit] w-full items-center justify-center p-4">
                    {item.category && isServiceSlug(item.category) ? (
                      <div className="text-terracotta/45 [&_svg]:h-20 [&_svg]:w-20 md:[&_svg]:h-28 md:[&_svg]:w-28">
                        <ServiceOrganicIcon slug={item.category} />
                      </div>
                    ) : (
                      <PlaceholderCard />
                    )}
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 flex translate-y-full flex-col justify-end bg-brown-deep/75 p-3 text-cream transition-transform duration-300 ease-out group-hover:translate-y-0 md:p-5">
                  <p
                    className={`font-serif leading-snug ${large ? 'text-xl md:text-2xl' : 'text-sm md:text-base'}`}
                  >
                    {titleText}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-cream/85">
                    {cat}
                  </p>
                  <span className="mt-2 text-xs">{viewProject}</span>
                </div>
              </div>
            );

            return (
              <motion.div
                key={item.id}
                className={`group relative ${pos} ${large ? 'min-h-[200px] md:min-h-0' : 'min-h-[140px]'}`}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ delay: idx * 0.06, duration: 0.45 }}
              >
                {hasBA ? (
                  <div
                    role="link"
                    tabIndex={0}
                    className={`${cardClass} cursor-pointer outline-none ring-brown-deep/30 focus-visible:ring-2`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('[data-ba-slider]')) return;
                      router.push(`/portfolio/${item.slug}`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/portfolio/${item.slug}`);
                      }
                    }}
                  >
                    {cardBody}
                  </div>
                ) : (
                  <Link href={`/portfolio/${item.slug}`} className={cardClass}>
                    {cardBody}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/portfolio"
            className="inline-flex text-sm font-medium text-terracotta underline-offset-4 transition hover:underline"
          >
            {seeAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
