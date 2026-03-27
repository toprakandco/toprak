'use client';

import { Link } from '@/i18n/navigation';
import { useId } from 'react';
import { useTranslations } from 'next-intl';

export function AboutCtaSection() {
  const t = useTranslations('about.ctaBanner');
  const subtitle = t('subtitle').trim();
  const patternId = useId().replace(/:/g, '');

  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden py-24"
      style={{
        background: 'linear-gradient(135deg, #8B3A1E 0%, #6B2C14 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 text-[#F5F0E6]" aria-hidden>
        <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern
              id={`${patternId}-soil`}
              width={80}
              height={80}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={12} cy={18} r={1.8} fill="currentColor" opacity={0.35} />
              <circle cx={38} cy={8} r={1.2} fill="currentColor" opacity={0.45} />
              <circle cx={62} cy={32} r={2.2} fill="currentColor" opacity={0.3} />
              <circle cx={24} cy={44} r={1.4} fill="currentColor" opacity={0.4} />
              <circle cx={54} cy={58} r={1.6} fill="currentColor" opacity={0.38} />
              <circle cx={8} cy={62} r={1} fill="currentColor" opacity={0.5} />
              <circle cx={72} cy={14} r={1.5} fill="currentColor" opacity={0.33} />
              <ellipse cx={44} cy={28} rx={2.5} ry={1.8} fill="currentColor" opacity={0.22} />
              <circle cx={30} cy={70} r={1.3} fill="currentColor" opacity={0.42} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId}-soil)`} opacity={0.06} />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2
          className="font-serif leading-[1.15] text-[#F5F0E6]"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
        >
          {t('title')}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#F5F0E6]/88 md:text-lg">
            {subtitle}
          </p>
        ) : null}
        <Link
          href="/contact"
          className="mt-10 inline-flex min-h-11 items-center justify-center rounded-full bg-[#F5F0E6] px-10 py-3 text-sm font-semibold text-[#6B2C14] shadow-sm transition hover:bg-[#EDE4D3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F0E6]"
        >
          {t('button')}
        </Link>
      </div>
    </section>
  );
}
