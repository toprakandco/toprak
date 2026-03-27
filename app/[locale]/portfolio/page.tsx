import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid';
import { PortfolioPageHeader } from '@/components/portfolio/PortfolioPageHeader';
import { getPortfolioItemsSafe } from '@/lib/supabase';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ locale: string }>;
};

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
      <PortfolioPageHeader
        overline={t('header.overline')}
        heading={t('header.heading')}
        subtitle={t('header.subtitle')}
        stats={t.raw('header.stats') as { value: string; label: string }[]}
      />

      <div className="container mt-10 pb-8 md:mt-14">
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
