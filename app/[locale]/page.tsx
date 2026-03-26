import { HomePageClient } from '@/components/home/HomePageClient';
import { getLatestBlogPostsForHome, getPortfolioItemsSafe } from '@/lib/supabase';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePageRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [blogPosts, portfolioItems] = await Promise.all([
    getLatestBlogPostsForHome(3),
    getPortfolioItemsSafe(undefined, 5),
  ]);

  return (
    <HomePageClient portfolioItems={portfolioItems} blogPosts={blogPosts} />
  );
}
