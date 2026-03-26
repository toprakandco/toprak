'use client';

import { CustomCursor } from '@/components/ui/CustomCursor';
import { HomeBlogGrid } from '@/components/home/HomeBlogGrid';
import { HomeClientsMarquee } from '@/components/home/HomeClientsMarquee';
import { HomeCtaFinal } from '@/components/home/HomeCtaFinal';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeManifesto } from '@/components/home/HomeManifesto';
import { HomeMarqueeStrip } from '@/components/home/HomeMarqueeStrip';
import { HomePortfolioBento } from '@/components/home/HomePortfolioBento';
import { HomeProcess } from '@/components/home/HomeProcess';
import { ServiceMorph } from '@/components/home/ServiceMorph';
import { HomeServicesGrid } from '@/components/home/HomeServicesGrid';
import { HomeStats } from '@/components/home/HomeStats';
import type { BlogPost, PortfolioItem } from '@/types';
import type { ServiceSlug } from '@/lib/service-slugs';
import { SERVICE_SLUGS } from '@/lib/service-slugs';
import { useTranslations } from 'next-intl';

export type HeroLine = {
  words: string[];
  italic?: boolean;
  emphasis?: boolean;
};

type CardCopy = { title: string; description: string };

type Props = {
  portfolioItems: PortfolioItem[];
  blogPosts: BlogPost[];
};

export function HomePageClient({ portfolioItems, blogPosts }: Props) {
  const t = useTranslations('home');

  const heroLines = t.raw('hero.lines') as HeroLine[];
  const marqueeRow1 = t.raw('marquee.row1') as string[];
  const morphItems = t.raw('serviceMorph.items') as {
    label: string;
    description: string;
    slug: string;
  }[];
  const manifestoLines = t.raw('manifesto.lines') as string[];
  const processSteps = t.raw('process.steps') as { title: string; desc: string }[];
  const clients = t.raw('clients.items') as string[];

  const cards = Object.fromEntries(
    SERVICE_SLUGS.map((slug) => [
      slug,
      {
        title: t(`servicesCards.${slug}.title`),
        description: t(`servicesCards.${slug}.description`),
      },
    ]),
  ) as Record<ServiceSlug, CardCopy>;

  return (
    <div className="overflow-x-hidden text-brown-deep">
      <CustomCursor />

      <HomeHero
        label={t('hero.label')}
        lines={heroLines}
        subtext={t('hero.subtext')}
        ctaPrimary={t('hero.ctaServices')}
        ctaSecondary={t('hero.ctaPortfolio')}
        scrollHint={t('hero.scrollHint')}
      />

      <HomeMarqueeStrip row1={marqueeRow1} />

      <HomeServicesGrid
        overline={t('servicesPreview.overline')}
        heading={t('servicesPreview.heading')}
        detailCta={t('servicesPreview.detailCta')}
        cards={cards}
      />

      <ServiceMorph
        overline={t('serviceMorph.overline')}
        prefix={t('serviceMorph.prefix')}
        suffix={t('serviceMorph.suffix')}
        items={morphItems}
      />

      <HomeManifesto
        lines={manifestoLines}
        body={t('manifesto.body')}
        cta={t('manifesto.cta')}
      />

      <HomeStats />

      <HomeProcess
        overline={t('process.overline')}
        heading={t('process.heading')}
        steps={processSteps}
      />

      <HomePortfolioBento
        title={t('portfolioPreview.title')}
        overline={t('portfolioPreview.overline')}
        seeAll={t('portfolioPreview.seeAll')}
        viewProject={t('portfolioPreview.viewProject')}
        items={portfolioItems}
        categoryFallback={t('portfolioPreview.categoryFallback')}
      />

      <HomeClientsMarquee
        title={t('clients.title')}
        items={clients}
        separator={t('marquee.separator')}
      />

      <HomeBlogGrid
        title={t('blogSection.title')}
        overline={t('blogSection.overline')}
        readMore={t('blogSection.readMore')}
        tagFallback={t('blogSection.tagFallback')}
        posts={blogPosts}
      />

      <HomeCtaFinal
        titleLine1={t('ctaFinal.titleLine1')}
        titleLine2={t('ctaFinal.titleLine2')}
        button={t('ctaFinal.button')}
      />
    </div>
  );
}
