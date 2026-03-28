'use client';

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
import { HomeStats, HomeStatsMobileRow } from '@/components/home/HomeStats';
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

type HomeOverrides = {
  heroLines?: HeroLine[] | null;
  heroSubtext?: string | null;
  clientsSectionTitle?: string | null;
};

type Props = {
  portfolioItems: PortfolioItem[];
  blogPosts: BlogPost[];
  homeOverrides?: HomeOverrides | null;
};

export function HomePageClient({ portfolioItems, blogPosts, homeOverrides }: Props) {
  const t = useTranslations('home');

  const defaultHeroLines = t.raw('hero.lines') as HeroLine[];
  const heroLines =
    homeOverrides?.heroLines && homeOverrides.heroLines.length > 0
      ? homeOverrides.heroLines
      : defaultHeroLines;
  const heroSubtext =
    homeOverrides?.heroSubtext?.trim() || t('hero.subtext');
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
      <HomeHero
        label={t('hero.label')}
        lines={heroLines}
        subtext={heroSubtext}
        ctaPrimary={t('hero.ctaServices')}
        ctaSecondary={t('hero.ctaPortfolio')}
        scrollHint={t('hero.scrollHint')}
      />

      <HomeStatsMobileRow />

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
        title={homeOverrides?.clientsSectionTitle?.trim() || t('clients.title')}
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
        buttonStart={t('ctaFinal.buttonStart')}
      />
    </div>
  );
}
