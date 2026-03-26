import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { getPortfolioItemsSafe } from '@/lib/supabase';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ locale: string }>;
};

function BranchDecoration() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 h-48 w-32 max-w-[35%] -translate-y-1/2 text-leaf opacity-[0.12] sm:right-8 md:h-64 md:w-40"
      viewBox="0 0 120 200"
      fill="none"
      aria-hidden
    >
      <path
        d="M60 190V40M60 100c-28-18-48-42-52-72M60 88c22-14 38-36 48-62M60 120c-18-10-32-26-40-46M60 112c16-8 28-22 36-40"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <path
        d="M22 78c-6 12-4 26 6 36 10-4 18-12 22-22-8-10-18-16-28-14z"
        fill="currentColor"
        opacity={0.35}
      />
      <path
        d="M92 52c-10 10-14 24-10 38 10 0 20-4 28-12-2-14-8-26-18-26z"
        fill="currentColor"
        opacity={0.28}
      />
    </svg>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'portfolio.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('portfolio');
  const items = await getPortfolioItemsSafe();

  return (
    <div className="text-brown-deep">
      <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-beige px-4 py-16 md:px-8 md:py-20">
        <BranchDecoration />
        <div className="relative mx-auto max-w-3xl text-center md:text-left">
          <h1 className="font-serif text-4xl text-brown-deep md:text-5xl lg:text-6xl">
            {t('pageTitle')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brown-deep/70 md:mx-0 md:text-lg">
            {t('pageSubtitle')}
          </p>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-6xl pb-8 md:mt-14">
        <Suspense
          fallback={
            <div className="min-h-[min(50vh,28rem)] animate-pulse rounded-2xl bg-beige/60" />
          }
        >
          <PortfolioGrid initialItems={items} locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
