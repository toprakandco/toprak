'use client';

import { Link } from '@/i18n/navigation';
import { ServiceSignatureIcon } from '@/components/services/ServiceSignatureIcon';
import type { ServiceSlug } from '@/lib/service-slugs';
import type { Service } from '@/types';
import { isServiceSlug } from '@/lib/service-slugs';
import { useMemo } from 'react';

type Props = {
  services: Service[];
  locale: string;
  detailLabel: string;
};

export function ServicesGridClient({ services, locale, detailLabel }: Props) {
  const cards = useMemo(
    () =>
      services.map((s, i) => {
        const title = locale === 'tr' ? s.title_tr : s.title_en;
        const description =
          (locale === 'tr' ? s.description_tr : s.description_en) ?? '';
        const slug = s.slug;
        const tags = s.tags ?? [];
        const iconSlug: ServiceSlug | null = isServiceSlug(slug) ? slug : null;
        const num = String((s.order_index || i + 1)).padStart(2, '0');

        return {
          slug,
          title,
          description,
          tags,
          num,
          iconSlug,
        };
      }),
    [services, locale],
  );

  return (
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {cards.map((card) => (
        <li key={card.slug}>
          <Link
            href={`/services/${card.slug}`}
            className="group relative block min-h-[44px] overflow-hidden rounded-[20px] border border-[#EDE4D3] bg-white px-8 py-9 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-250 ease-out hover:-translate-y-1.5 hover:border-[#7A9E6E] hover:shadow-[0_16px_48px_rgba(122,158,110,0.14)]"
          >
            <span className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#7A9E6E] to-[#C4824A] opacity-0 transition-opacity duration-250 group-hover:opacity-100" />
            <span className="absolute right-7 top-6 font-serif text-[13px] text-[#8B3A1E]/25">
              {card.num}
            </span>

            <div className="mb-[22px] flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#EAF3DE,#F5F0E6)] transition-all duration-300 group-hover:bg-[linear-gradient(135deg,#d4edcc,#EAF3DE)]">
              {card.iconSlug ? (
                <ServiceSignatureIcon
                  slug={card.iconSlug}
                  className="h-[34px] w-[34px]"
                />
              ) : null}
            </div>

            <h3 className="mb-2 font-serif text-[22px] text-[#3D1F10]">{card.title}</h3>
            <p className="mb-[14px] text-[13px] leading-[1.7] text-[#7A6050]">
              {card.description}
            </p>

            {card.tags.length > 0 ? (
              <div className="mb-4 flex flex-wrap">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="m-[3px_2px] rounded-[20px] border border-[#EDE4D3] bg-[#F5F0E6] px-3 py-1 text-[11px] text-[#7A6050]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <span className="mt-4 inline-block text-[13px] text-[#8B3A1E] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#6B2C14]">
              {detailLabel}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
