'use client';

import { BeforeAfterSlider } from '@/components/portfolio/BeforeAfterSlider';
import { ServiceOrganicIcon } from '@/components/services/ServiceOrganicIcon';
import { Link, useRouter } from '@/i18n/navigation';
import { isServiceSlug } from '@/lib/service-slugs';
import type { PortfolioItem } from '@/types';
import Image from 'next/image';

type Props = {
  item: PortfolioItem;
  locale: string;
  index?: number;
  categoryLabel: string;
  ctaLabel: string;
};

export function PortfolioCard({ item, locale, index = 0, categoryLabel, ctaLabel }: Props) {
  void locale;
  const router = useRouter();
  const title = locale === 'tr' ? item.title_tr : item.title_en;
  const cat = item.category;
  const ratioByIndex = ['aspect-[4/3]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/4]'];
  const ratioClass = ratioByIndex[index % ratioByIndex.length];
  const hasBeforeAfter = Boolean(item.before_image && item.after_image);

  const showIcon =
    cat && isServiceSlug(cat) ? (
      <div className="flex h-full w-full items-center justify-center p-8 [&_svg]:h-12 [&_svg]:w-12 [&_svg]:text-terracotta/30">
        <ServiceOrganicIcon slug={cat} />
      </div>
    ) : (
      <div className="flex h-full w-full min-h-[220px] items-center justify-center text-terracotta/30">
        <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" aria-hidden>
          <path
            d="M12 50L28 20l10 16 8-8 16 22H12z"
            stroke="currentColor"
            strokeWidth={1.4}
          />
          <circle cx="24" cy="18" r="4" stroke="currentColor" strokeWidth={1.4} />
        </svg>
      </div>
    );

  const media = (
    <div className={`relative w-full overflow-hidden rounded-2xl ${ratioClass} bg-beige`}>
      {hasBeforeAfter ? (
        <BeforeAfterSlider
          beforeImage={item.before_image!}
          afterImage={item.after_image!}
          title={title}
          className="absolute inset-0 h-full min-h-[220px] w-full"
        />
      ) : item.cover_image ? (
        <Image
          src={item.cover_image}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="h-full w-full bg-[linear-gradient(135deg,#EDE4D3,#F5F0E6)]">{showIcon}</div>
      )}

      <div
        className="pointer-events-none absolute inset-0 flex translate-y-full flex-col justify-between bg-[linear-gradient(to_top,rgba(61,31,16,0.92)_0%,rgba(61,31,16,0.4)_50%,transparent_100%)] p-5 text-cream transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none"
        aria-hidden
      >
        <span className="inline-flex w-fit rounded-full bg-leaf px-2.5 py-1 text-[11px] text-cream">
          {categoryLabel}
        </span>
        <div className="flex items-end justify-between gap-3">
          <p className="translate-y-3 font-serif text-[20px] leading-snug text-cream transition-transform duration-500 group-hover:translate-y-0">
            {title}
          </p>
          <span className="text-[13px] text-cream/95">{ctaLabel}</span>
        </div>
      </div>
    </div>
  );

  if (hasBeforeAfter) {
    return (
      <div
        role="link"
        tabIndex={0}
        className="group relative block cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-white outline-none ring-brown-deep/30 focus-visible:ring-2"
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
        {media}
        {item.is_featured ? (
          <span className="absolute right-0 top-0 inline-flex rounded-bl-md bg-gold px-2 py-1 text-[11px] text-cream">
            ✦
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <Link
      href={`/portfolio/${item.slug}`}
      aria-label={`${title}, ${categoryLabel}. ${ctaLabel}`}
      className="group relative block cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-white"
    >
      {media}
      {item.is_featured ? (
        <span className="absolute right-0 top-0 inline-flex rounded-bl-md bg-gold px-2 py-1 text-[11px] text-cream">
          ✦
        </span>
      ) : null}
    </Link>
  );
}
