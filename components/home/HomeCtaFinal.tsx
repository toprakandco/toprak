'use client';

import { Link } from '@/i18n/navigation';
import { Magnetic } from '@/components/home/Magnetic';
import { useId } from 'react';

type Props = {
  titleLine1: string;
  titleLine2: string;
  button: string;
  /** İkincil CTA — /start proje başvuru formu */
  buttonStart?: string;
};

export function HomeCtaFinal({ titleLine1, titleLine2, button, buttonStart }: Props) {
  const patternId = useId().replace(/:/g, '');

  return (
    <section
      className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 overflow-hidden bg-brown-deep py-24 text-cream md:py-32"
      data-spotlight-dark
    >
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
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Magnetic maxPx={8}>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-12 py-3.5 text-base font-semibold text-cream shadow-lg transition hover:bg-accent-dark"
            >
              {button}
            </Link>
          </Magnetic>
          {buttonStart ? (
            <Magnetic maxPx={8}>
              <Link
                href="/start"
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-cream/80 bg-transparent px-10 py-3.5 text-base font-semibold text-cream transition hover:bg-cream/10"
              >
                {buttonStart}
              </Link>
            </Magnetic>
          ) : null}
        </div>
      </div>
    </section>
  );
}
