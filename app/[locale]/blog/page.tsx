import { BlogCard } from '@/components/blog/BlogCard';
import { sortBlogPostsForListing } from '@/lib/blog-utils';
import { getBlogPostsSafe } from '@/lib/supabase';
import { Link } from '@/i18n/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const POSTS_PER_PAGE = 9;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageRaw } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('blog');

  const allPosts = await getBlogPostsSafe();
  const sorted = sortBlogPostsForListing(allPosts);

  const heroPost = sorted.length > 0 ? sorted[0] : null;
  const rest = heroPost ? sorted.slice(1) : [];

  const totalPages = Math.max(1, Math.ceil(rest.length / POSTS_PER_PAGE));
  const raw = parseInt(pageRaw ?? '1', 10);
  const requested = Number.isFinite(raw) && raw >= 1 ? raw : 1;
  if (requested < 1 || requested > totalPages) {
    notFound();
  }
  const pageNum = requested;

  const pageItems = rest.slice(
    (pageNum - 1) * POSTS_PER_PAGE,
    pageNum * POSTS_PER_PAGE,
  );
  const showHero = pageNum === 1 && heroPost !== null;

  return (
    <div className="text-brown-deep">
      <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-beige px-4 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center md:text-left">
          <h1 className="font-serif text-4xl text-brown-deep md:text-5xl lg:text-6xl">
            {t('pageTitle')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brown-deep/70 md:mx-0 md:text-lg">
            {t('pageSubtitle')}
          </p>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-6xl pb-12 md:mt-14">
        {sorted.length === 0 ? (
          <p className="py-16 text-center text-brown-deep/70 md:py-24">
            {t('emptyState')}
          </p>
        ) : (
          <>
            {showHero && heroPost ? (
              <div className="mb-12 md:mb-16">
                <BlogCard
                  post={heroPost}
                  locale={locale}
                  featured
                  readMoreLabel={t('hero.readMore')}
                  readShortLabel={t('card.readShort')}
                />
              </div>
            ) : null}

            {pageItems.length > 0 ? (
              <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((post) => (
                  <li key={post.id} className="flex">
                    <BlogCard
                      post={post}
                      locale={locale}
                      featured={false}
                      readMoreLabel={t('hero.readMore')}
                      readShortLabel={t('card.readShort')}
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            {totalPages > 1 ? (
              <nav
                className="mt-12 flex flex-wrap items-center justify-center gap-4 md:mt-16"
                aria-label={t('pagination.aria')}
              >
                {pageNum > 1 ? (
                  <Link
                    href={
                      pageNum === 2
                        ? '/blog'
                        : `/blog?page=${pageNum - 1}`
                    }
                    className="inline-flex min-h-11 min-w-[7rem] items-center justify-center rounded-full border-2 border-terracotta bg-transparent px-6 py-2.5 text-sm font-medium text-terracotta transition hover:bg-terracotta/10"
                  >
                    {t('pagination.previous')}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 min-w-[7rem] items-center justify-center rounded-full border-2 border-beige px-6 py-2.5 text-sm text-brown-deep/35">
                    {t('pagination.previous')}
                  </span>
                )}
                <span className="text-sm text-brown-deep/60">
                  {t('pagination.page', { current: pageNum, total: totalPages })}
                </span>
                {pageNum < totalPages ? (
                  <Link
                    href={`/blog?page=${pageNum + 1}`}
                    className="inline-flex min-h-11 min-w-[7rem] items-center justify-center rounded-full border-2 border-terracotta bg-transparent px-6 py-2.5 text-sm font-medium text-terracotta transition hover:bg-terracotta/10"
                  >
                    {t('pagination.next')}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 min-w-[7rem] items-center justify-center rounded-full border-2 border-beige px-6 py-2.5 text-sm text-brown-deep/35">
                    {t('pagination.next')}
                  </span>
                )}
              </nav>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
