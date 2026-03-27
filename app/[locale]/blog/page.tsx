import { BlogPageClient } from '@/components/blog/BlogPageClient';
import {
  BLOG_POSTS_PER_PAGE,
  filterPostsByTag,
  sortBlogPostsForListing,
} from '@/lib/blog-utils';
import { getBlogPostsSafe } from '@/lib/supabase';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; tag?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

function collectTags(
  posts: { tags?: string[] }[],
  locale: string,
): string[] {
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags?.forEach((x) => tagSet.add(x.trim())));
  return Array.from(tagSet)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, locale === 'tr' ? 'tr' : 'en'));
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('blog');

  const allPosts = await getBlogPostsSafe();
  const sorted = sortBlogPostsForListing(allPosts);
  const featured = sorted.find((p) => p.is_featured) ?? null;
  const rest = sorted.filter((p) => p.id !== featured?.id);

  const tag = typeof sp.tag === 'string' && sp.tag ? sp.tag : 'all';
  const rawPage = parseInt(sp.page ?? '1', 10);
  const pageNum = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const filtered = filterPostsByTag(rest, tag);
  const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_POSTS_PER_PAGE));
  if (pageNum > totalPages) {
    notFound();
  }

  const tags = collectTags(sorted, locale);

  const line1 = [t('listing.head1a'), t('listing.head1b')];
  const line2 = [t('listing.head2a')];

  return (
    <Suspense
      fallback={
        <div
          className="min-h-[50vh] bg-[#F5F0E6]"
          aria-hidden
        />
      }
    >
      <BlogPageClient
        posts={rest}
        featured={featured}
        tags={tags}
        locale={locale}
        line1={line1}
        line2={line2}
      />
    </Suspense>
  );
}
