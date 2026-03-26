import { BlogCard } from '@/components/blog/BlogCard';
import { BlogShareBar } from '@/components/blog/BlogShareBar';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
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
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import Image from 'next/image';
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
    return { title: t('title') };
  }

  const title = locale === 'tr' ? post.title_tr : post.title_en;
  const description =
    (locale === 'tr' ? post.excerpt_tr : post.excerpt_en) ??
    (locale === 'tr' ? post.content_tr : post.content_en).slice(0, 160);

  return {
    title: `${title} | Toprak & Co.`,
    description,
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

  return (
    <>
      <ReadingProgress />
      <article className="pb-28 text-brown-deep md:pb-0">
        <section className="mx-auto max-w-6xl px-0 pt-4 md:pt-6">
          <nav
            className="text-sm text-brown-deep/55"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-terracotta">
                  {t('breadcrumbHome')}
                </Link>
              </li>
              <li aria-hidden className="text-brown-deep/35">
                /
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition hover:text-terracotta"
                >
                  {t('breadcrumbBlog')}
                </Link>
              </li>
              <li aria-hidden className="text-brown-deep/35">
                /
              </li>
              <li className="max-w-[min(100%,12rem)] truncate font-medium text-brown-deep/80 md:max-w-none">
                {title}
              </li>
            </ol>
          </nav>

          {post.tags?.length ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-leaf/12 px-3 py-1 text-xs font-medium text-leaf-dark ring-1 ring-leaf/25"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <h1 className="mt-6 font-serif text-3xl leading-tight text-brown-deep md:text-5xl md:leading-[1.15]">
            {title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-brown-deep/60">
            {dateStr ? (
              <time dateTime={post.published_at ?? undefined}>{dateStr}</time>
            ) : null}
            <span aria-hidden className="text-brown-deep/30">
              ·
            </span>
            <span>{t('readMinutes', { count: minutes })}</span>
          </div>
        </section>

        {post.cover_image ? (
          <div className="relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 px-4 md:mt-12 md:px-8">
            <div className="relative mx-auto max-h-[480px] max-w-6xl overflow-hidden rounded-lg">
              <Image
                src={post.cover_image}
                alt={title}
                width={1600}
                height={900}
                priority
                className="max-h-[480px] w-full object-cover"
                sizes="(max-width: 1200px) 100vw, 1152px"
              />
            </div>
          </div>
        ) : null}

        <div className="mx-auto mt-10 grid max-w-6xl gap-10 md:mt-12 md:grid-cols-[1fr_14rem] md:gap-12 lg:grid-cols-[1fr_16rem]">
          <div className="min-w-0">
            <div
              className="blog-prose prose prose-lg max-w-none text-brown-deep"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="mt-12 rounded-2xl border border-beige bg-beige/50 p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf"
                  aria-hidden
                >
                  <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
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
                <div className="flex-1">
                  <p className="text-base leading-relaxed text-brown-deep">
                    {t('authorBlurb')}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-3 inline-flex text-sm font-semibold text-terracotta underline-offset-4 transition hover:underline"
                  >
                    {t('authorCta')}
                  </Link>
                </div>
              </div>
            </div>

            {related.length > 0 ? (
              <section className="mt-16 md:mt-20">
                <h2 className="font-serif text-2xl text-brown-deep md:text-3xl">
                  {t('relatedTitle')}
                </h2>
                <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((p) => (
                    <li key={p.id} className="flex">
                      <BlogCard
                        post={p}
                        locale={locale}
                        featured={false}
                        readMoreLabel={tBlog('hero.readMore')}
                        readShortLabel={tBlog('card.readShort')}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          {shareUrl ? (
            <aside className="hidden min-w-0 md:block">
              <div className="sticky top-28">
                <BlogShareBar shareUrl={shareUrl} title={title} />
              </div>
            </aside>
          ) : null}
        </div>

        {shareUrl ? (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-beige bg-cream/95 p-4 shadow-[0_-4px_24px_rgba(61,31,16,0.08)] backdrop-blur-sm md:hidden">
            <BlogShareBar shareUrl={shareUrl} title={title} />
          </div>
        ) : null}
      </article>
    </>
  );
}
