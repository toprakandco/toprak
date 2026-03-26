'use client';

import { Link } from '@/i18n/navigation';
import { useId } from 'react';
import { useTranslations } from 'next-intl';

export function AboutCtaSection() {
  const t = useTranslations('about.ctaBanner');
  const subtitle = t('subtitle').trim();
  const patternId = useId().replace(/:/g, '');

  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-terracotta py-20 text-cream md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
      >
        <svg className="h-full w-full text-cream" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern
              id={`${patternId}-about-cta`}
              width={72}
              height={72}
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M36 8c-6 10-14 18-22 26 4 8 12 14 22 18 8-4 16-10 20-18-8-8-16-16-20-26z"
                fill="currentColor"
                opacity={0.4}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId}-about-cta)`} />
        </svg>
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="font-serif text-3xl leading-tight md:text-4xl lg:text-5xl">
          {t('title')}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-5 max-w-xl text-sm text-cream/85 md:text-base">
            {subtitle}
          </p>
        ) : null}
        <Link
          href="/contact"
          className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-cream px-10 py-3 text-sm font-semibold text-terracotta shadow-sm transition hover:bg-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          {t('button')}
        </Link>
      </div>
    </section>
  );
}
