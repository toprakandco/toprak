import { AnimatedArticleTitle } from '@/components/blog/AnimatedArticleTitle';
import { ArticleBody } from '@/components/blog/ArticleBody';
import { ArticleCoverParallax } from '@/components/blog/ArticleCoverParallax';
import { BlogMasonryCard } from '@/components/blog/BlogMasonryCard';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { ShareBar } from '@/components/blog/ShareBar';
import { TableOfContents } from '@/components/blog/TableOfContents';
import {
  estimateReadingMinutes,
  formatBlogDate,
} from '@/lib/blog-utils';
import { SEED_BLOG_SLUGS } from '@/lib/seed-blog';
import {
  getActiveBlogSlugs,
  getBlogPostBySlugSafe,
  getRelatedBlogPostsByTags,
} from '@/lib/supabase';
import { Link } from '@/i18n/navigation';
import { socialMetadata } from '@/lib/seo-metadata';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const fromDb = await getActiveBlogSlugs();
  const slugs =
    fromDb.length > 0 ? fromDb : (SEED_BLOG_SLUGS as readonly string[]).slice();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlugSafe(slug);
  const t = await getTranslations({ locale, namespace: 'blog.meta' });

  if (!post) {
    const fallbackTitle = t('title');
    const fallbackDesc = t('description');
    return {
      title: fallbackTitle,
      ...socialMetadata(locale, fallbackTitle, fallbackDesc, `/blog/${slug}`),
    };
  }

  const title = locale === 'tr' ? post.title_tr : post.title_en;
  const description =
    (locale === 'tr' ? post.excerpt_tr : post.excerpt_en) ??
    (locale === 'tr' ? post.content_tr : post.content_en).slice(0, 160);
  const pageTitle = `${title} | Toprak & Co.`;

  return {
    title: pageTitle,
    description,
    ...socialMetadata(locale, pageTitle, description, `/blog/${slug}`),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlugSafe(slug);

  if (!post) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations('blog.detail');
  const tBlog = await getTranslations('blog');

  const title = locale === 'tr' ? post.title_tr : post.title_en;
  const content = locale === 'tr' ? post.content_tr : post.content_en;
  const minutes = estimateReadingMinutes(content);
  const dateStr = formatBlogDate(post.published_at, locale);

  const related = await getRelatedBlogPostsByTags(post.slug, post.tags ?? [], 3);

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const base = host ? `${proto}://${host}` : '';
  const shareUrl = base ? `${base}/${locale}/blog/${slug}` : '';

  const readTimeLabel = (n: number) => tBlog('readMinutesApprox', { count: n });

  return (
    <>
      <ReadingProgress />
      <article className="pb-28 text-[#3D1F10] lg:pb-12 lg:pl-[4.5rem]">
        <header
          className="border-b border-[#EDE4D3]/50 pb-10 pt-4 md:pt-6"
          style={{ backgroundColor: '#F5F0E6' }}
        >
          <div className="container">
            <nav
              className="text-sm text-[#3D1F10]/55"
              aria-label="Breadcrumb"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="transition hover:text-accent">
                    {t('breadcrumbHome')}
                  </Link>
                </li>
                <li aria-hidden className="text-[#3D1F10]/35">
                  /
                </li>
                <li>
                  <Link href="/blog" className="transition hover:text-accent">
                    {t('breadcrumbBlog')}
                  </Link>
                </li>
                <li aria-hidden className="text-[#3D1F10]/35">
                  /
                </li>
                <li className="max-w-[min(100%,14rem)] truncate font-medium text-[#3D1F10]/80 md:max-w-none">
                  {title}
                </li>
              </ol>
            </nav>

            {post.tags?.length ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-[#7A9E6E]/15 px-3 py-1 text-xs font-medium text-[#3D1F10] ring-1 ring-[#7A9E6E]/25"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <AnimatedArticleTitle title={title} />

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#3D1F10]/60">
              {dateStr ? (
                <time dateTime={post.published_at ?? undefined}>{dateStr}</time>
              ) : null}
              {dateStr ? (
                <span aria-hidden className="text-[#3D1F10]/30">
                  ·
                </span>
              ) : null}
              <span>{readTimeLabel(minutes)}</span>
            </div>
          </div>
        </header>

        {post.cover_image ? (
          <ArticleCoverParallax src={post.cover_image} alt={title} />
        ) : null}

        <div className="container mt-10 md:mt-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
            <div className="min-w-0 flex-1 lg:max-w-[720px]">
              <ArticleBody content={content} />

              <section
                className="mt-14 rounded-2xl border border-[#EDE4D3]/80 p-8 md:p-10"
                style={{ backgroundColor: '#F5F0E6' }}
                aria-labelledby="author-card-heading"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#7A9E6E] bg-[#EAF3DE]"
                    aria-hidden
                  >
                    <svg viewBox="0 0 48 48" className="h-9 w-9 text-[#7A9E6E]" fill="none">
                      <path
                        d="M24 42V14M24 28c-10-6-16-14-18-24M24 22c8-5 14-13 16-22"
                        stroke="currentColor"
                        strokeWidth={1.3}
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 20c-4 8-2 16 6 20 6-4 10-10 10-18-6-4-12-4-16-2z"
                        fill="currentColor"
                        opacity={0.25}
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2
                      id="author-card-heading"
                      className="font-serif text-lg text-[#3D1F10] md:text-[18px]"
                    >
                      {t('authorName')}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#3D1F10]/75 md:text-[15px]">
                      {t('authorBio')}
                    </p>
                    <Link
                      href="/contact"
                      className="mt-5 inline-flex text-sm font-semibold text-accent underline-offset-4 transition hover:underline"
                    >
                      {t('authorCtaCollaborate')}
                    </Link>
                  </div>
                </div>
              </section>

              {related.length > 0 ? (
                <section className="mt-16 md:mt-20">
                  <h2 className="font-serif text-2xl text-[#3D1F10] md:text-3xl">
                    {t('relatedTitle')}
                  </h2>
                  <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {related.map((p, i) => (
                      <li key={p.id} className="flex">
                        <BlogMasonryCard
                          post={p}
                          locale={locale}
                          styleVariant={0}
                          motionIndex={i}
                          readShort={tBlog('card.readShort')}
                          readTimeLabel={readTimeLabel}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <TableOfContents containerId="article-body" contentKey={slug} />
          </div>
        </div>

        {shareUrl ? <ShareBar shareUrl={shareUrl} title={title} /> : null}
      </article>
    </>
  );
}
