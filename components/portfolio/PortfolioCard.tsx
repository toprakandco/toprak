import { ServiceOrganicIcon } from '@/components/services/ServiceOrganicIcon';
import { Link } from '@/i18n/navigation';
import { isServiceSlug } from '@/lib/service-slugs';
import type { PortfolioItem } from '@/types';
import Image from 'next/image';

type Props = {
  item: PortfolioItem;
  locale: string;
  categoryLabel: string;
  ctaLabel: string;
};

export function PortfolioCard({ item, locale, categoryLabel, ctaLabel }: Props) {
  const title = locale === 'tr' ? item.title_tr : item.title_en;
  const cat = item.category;
  const showIcon =
    cat && isServiceSlug(cat) ? (
      <div className="flex h-full w-full items-center justify-center p-8 [&_svg]:h-24 [&_svg]:w-24">
        <ServiceOrganicIcon slug={cat} />
      </div>
    ) : (
      <div className="flex h-full w-full items-center justify-center text-leaf/35">
        <svg viewBox="0 0 64 64" className="h-20 w-20" fill="none" aria-hidden>
          <path
            d="M12 48L28 20l10 16 8-8 16 20H12z"
            stroke="currentColor"
            strokeWidth={1.2}
          />
          <circle cx="24" cy="18" r="4" stroke="currentColor" strokeWidth={1.2} />
        </svg>
      </div>
    );

  return (
    <Link
      href={`/portfolio/${item.slug}`}
      aria-label={`${title}, ${categoryLabel}. ${ctaLabel}`}
      className={`group relative block break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md ${
        item.is_featured ? 'ring-2 ring-gold' : 'ring-1 ring-beige'
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-beige">
        {item.cover_image ? (
          <Image
            src={item.cover_image}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          showIcon
        )}

        <div
          className="pointer-events-none absolute inset-0 flex translate-y-full flex-col justify-end bg-terracotta/90 p-5 text-cream transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 motion-reduce:transition-none motion-reduce:duration-0"
          aria-hidden
        >
          <p className="font-serif text-lg leading-snug md:text-xl">{title}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-cream/85">
            {categoryLabel}
          </p>
          <span className="mt-3 inline-flex text-sm font-medium">{ctaLabel}</span>
        </div>
      </div>

    </Link>
  );
}
