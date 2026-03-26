'use client';

import { Link } from '@/i18n/navigation';
import { Magnetic } from '@/components/home/Magnetic';
import { useId } from 'react';

type Props = {
  titleLine1: string;
  titleLine2: string;
  button: string;
};

export function HomeCtaFinal({ titleLine1, titleLine2, button }: Props) {
  const patternId = useId().replace(/:/g, '');

  return (
    <section className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 overflow-hidden bg-brown-deep py-24 text-cream md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
      >
        <svg className="h-full w-full text-cream" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern
              id={`${patternId}-leaf-cta`}
              width={80}
              height={80}
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 10c-8 12-12 28-8 44 10-4 18-14 22-26 4 12 2 26-6 38"
                fill="none"
                stroke="currentColor"
                strokeWidth={0.8}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId}-leaf-cta)`} />
        </svg>
      </div>
      <div className="relative mx-auto w-full max-w-[1280px] px-[max(24px,5vw)] text-center">
        <h2 className="font-serif text-[2.5rem] leading-tight text-cream md:text-[52px]">
          {titleLine1}
          <br />
          {titleLine2}
        </h2>
        <div className="mt-12 flex justify-center">
          <Magnetic maxPx={8}>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-terracotta px-12 py-3.5 text-base font-semibold text-cream shadow-lg transition hover:bg-terracotta-dark"
            >
              {button}
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
