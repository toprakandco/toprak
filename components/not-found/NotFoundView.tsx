'use client';

import { Link } from '@/i18n/navigation';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { NotFoundLeafCanvas } from './NotFoundLeafCanvas';
import { Seedling404Svg } from './Seedling404Svg';

type Props = {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  /** next-intl Link (locale-aware) */
  linkMode: 'intl' | 'static';
  /** Used when linkMode is static: /tr, /en, etc. */
  localePrefix?: string;
  /** When true, main fills viewport under navbar (locale layout). */
  withNavbarOffset?: boolean;
};

export function NotFoundView({
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  linkMode,
  localePrefix = '/tr',
  withNavbarOffset = false,
}: Props) {
  const heightClass = withNavbarOffset
    ? 'min-h-[calc(100svh-var(--navbar-height))]'
    : 'min-h-[100svh]';

  const primary =
    linkMode === 'intl' ? (
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-8 py-3 text-sm font-medium text-cream shadow-sm transition hover:bg-accent-dark"
      >
        {primaryLabel}
      </Link>
    ) : (
      <NextLink
        href={localePrefix}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-8 py-3 text-sm font-medium text-cream shadow-sm transition hover:bg-accent-dark"
      >
        {primaryLabel}
      </NextLink>
    );

  const secondary =
    linkMode === 'intl' ? (
      <Link
        href="/contact"
        className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-accent bg-transparent px-8 py-3 text-sm font-medium text-accent transition hover:bg-accent/10"
      >
        {secondaryLabel}
      </Link>
    ) : (
      <NextLink
        href={`${localePrefix}/contact`}
        className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-accent bg-transparent px-8 py-3 text-sm font-medium text-accent transition hover:bg-accent/10"
      >
        {secondaryLabel}
      </NextLink>
    );

  return (
    <div
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#F5F0E6] px-4 py-10 ${heightClass}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <NotFoundLeafCanvas />
      </div>

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <div className="relative w-full">
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-serif text-[clamp(80px,12vw,140px)] leading-none text-accent opacity-[0.08]"
            aria-hidden
          >
            404
          </span>

          <motion.div
            className="relative mx-auto flex justify-center pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Seedling404Svg />
          </motion.div>
        </div>

        <motion.h1
          className="relative z-[1] mt-6 max-w-md font-serif text-[28px] leading-snug text-[#3D1F10]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="relative z-[1] mt-3 max-w-sm text-sm text-brown-deep/55"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="relative z-[1] mt-10 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {primary}
          {secondary}
        </motion.div>
      </div>
    </div>
  );
}
