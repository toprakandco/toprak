import { HomePageClient } from '@/components/home/HomePageClient';
import { parseHeroHeadingOverride } from '@/lib/home-hero-override';
import { getSiteSettingsMapSafe } from '@/lib/site-settings';
import { getLatestBlogPostsForHome, getPortfolioItemsSafe } from '@/lib/supabase';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePageRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [blogPosts, portfolioItems, settingsMap] = await Promise.all([
    getLatestBlogPostsForHome(3),
    getPortfolioItemsSafe(undefined, 5),
    getSiteSettingsMapSafe(),
  ]);

  const heroLinesOverride =
    locale === 'en'
      ? parseHeroHeadingOverride(settingsMap.get('hero_heading_en'))
      : parseHeroHeadingOverride(settingsMap.get('hero_heading_tr'));
  const heroSubOverrideRaw =
    locale === 'en'
      ? settingsMap.get('hero_subtitle_en')
      : settingsMap.get('hero_subtitle_tr');
  const heroSubOverride = heroSubOverrideRaw?.trim() || undefined;
  const clientsSectionTitle =
    settingsMap.get('clients_section_title')?.trim() || undefined;

  return (
    <HomePageClient
      portfolioItems={portfolioItems}
      blogPosts={blogPosts}
      homeOverrides={{
        heroLines: heroLinesOverride ?? undefined,
        heroSubtext: heroSubOverride,
        clientsSectionTitle,
      }}
    />
  );
}
