'use client';

import { BlogFeaturedHero } from '@/components/blog/BlogFeaturedHero';
import { BlogListingHeader } from '@/components/blog/BlogListingHeader';
import { BlogMasonryCard } from '@/components/blog/BlogMasonryCard';
import { BlogNewsletter } from '@/components/blog/BlogNewsletter';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { BLOG_POSTS_PER_PAGE } from '@/lib/blog-utils';
import type { BlogPost } from '@/types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Fragment, useMemo } from 'react';

type Props = {
  posts: BlogPost[];
  featured: BlogPost | null;
  tags: string[];
  locale: string;
  line1: string[];
  line2: string[];
};

function blogHref(tag: string, page: number): string {
  const qs = new URLSearchParams();
  if (tag !== 'all') qs.set('tag', tag);
  if (page > 1) qs.set('page', String(page));
  const q = qs.toString();
  return q ? `/blog?${q}` : '/blog';
}

function getVisiblePages(total: number, current: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const s = new Set<number>();
  s.add(1);
  s.add(total);
  for (let i = current - 2; i <= current + 2; i++) {
    if (i >= 1 && i <= total) s.add(i);
  }
  return [...s].sort((a, b) => a - b);
}

export function BlogPageClient({ posts, featured, tags, locale, line1, line2 }: Props) {
  const t = useTranslations('blog');
  const sp = useSearchParams();
  const reduce = useReducedMotion();

  const tag = sp.get('tag') ?? 'all';
  const rawPage = parseInt(sp.get('page') ?? '1', 10);
  const pageNum = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const filtered = useMemo(() => {
    if (tag === 'all') return posts;
    return posts.filter((p) => p.tags?.some((x) => x === tag));
  }, [posts, tag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_POSTS_PER_PAGE));
  const safePage = Math.min(pageNum, totalPages);
  const slice = filtered.slice(
    (safePage - 1) * BLOG_POSTS_PER_PAGE,
    safePage * BLOG_POSTS_PER_PAGE,
  );

  const globalStart = (safePage - 1) * BLOG_POSTS_PER_PAGE;

  const readTimeLabel = (mins: number) => t('readMinutesApprox', { count: mins });

  const showFeatured = Boolean(featured && safePage === 1 && tag === 'all');

  const renderGridChunk = (items: BlogPost[], offset: number) => (
    <div className="columns-1 gap-6 md:columns-2 lg:columns-3 lg:gap-8">
      {items.map((post, i) => (
        <div key={post.id} className="mb-6 break-inside-avoid lg:mb-8">
          <BlogMasonryCard
            post={post}
            locale={locale}
            styleVariant={((offset + i) % 3) as 0 | 1 | 2}
            motionIndex={i}
            readShort={t('card.readShort')}
            readTimeLabel={readTimeLabel}
          />
        </div>
      ))}
    </div>
  );

  const gridSections = () => {
    if (slice.length === 0) return null;
    if (slice.length <= 6) {
      return (
        <>
          {renderGridChunk(slice, globalStart)}
          <div className="mt-6 break-inside-avoid lg:mt-8">
            <BlogNewsletter />
          </div>
        </>
      );
    }
    return (
      <>
        {renderGridChunk(slice.slice(0, 6), globalStart)}
        <div className="my-6 break-inside-avoid lg:my-8">
          <BlogNewsletter />
        </div>
        {renderGridChunk(slice.slice(6), globalStart + 6)}
      </>
    );
  };

  const visiblePages = getVisiblePages(totalPages, safePage);

  if (!featured && posts.length === 0) {
    return (
      <div className="text-[#3D1F10]">
        <BlogListingHeader
          line1={line1}
          line2={line2}
          overline={t('listing.overline')}
          marquee={t('listing.marquee')}
        />
        <div className="container py-24 text-center text-[#3D1F10]/65">
          {t('emptyState')}
        </div>
      </div>
    );
  }

  return (
    <div className="text-[#3D1F10]">
      <BlogListingHeader
        line1={line1}
        line2={line2}
        overline={t('listing.overline')}
        marquee={t('listing.marquee')}
      />

      <div className="sticky top-[var(--navbar-height)] z-30 -mx-4 border-b border-[#EDE4D3]/60 bg-[#F5F0E6]/72 px-4 py-3 backdrop-blur-md [-webkit-backdrop-filter:blur(12px)] md:-mx-6 md:px-6">
        <div className="container flex max-w-6xl flex-wrap gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          <FilterPill
            href={blogHref('all', 1)}
            active={tag === 'all'}
            label={t('listing.filterAll')}
            reduce={reduce}
          />
          {tags.map((tg) => (
            <FilterPill
              key={tg}
              href={blogHref(tg, 1)}
              active={tag === tg}
              label={tg}
              reduce={reduce}
            />
          ))}
        </div>
      </div>

      <div className="container mt-10 max-w-6xl pb-20 md:mt-12">
        {showFeatured && featured ? (
          <div className="mb-12 md:mb-16">
            <BlogFeaturedHero
              post={featured}
              locale={locale}
              badge={t('listing.featuredBadge')}
              readMore={t('hero.readMore')}
              readTimeLabel={readTimeLabel}
            />
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-[#3D1F10]/60">{t('listing.noResults')}</p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tag}-${safePage}`}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            >
              {gridSections()}
            </motion.div>
          </AnimatePresence>
        )}

        {totalPages > 1 ? (
          <nav
            className="mt-14 flex flex-wrap items-center justify-center gap-2 md:mt-20"
            aria-label={t('pagination.aria')}
          >
            {safePage > 1 ? (
              <Link
                href={blogHref(tag, safePage - 1)}
                className="min-h-10 rounded-full px-4 py-2 text-sm text-[#3D1F10]/70 transition hover:text-[#8B3A1E]"
              >
                {t('pagination.previous')}
              </Link>
            ) : (
              <span className="min-h-10 px-4 py-2 text-sm text-[#3D1F10]/25">
                {t('pagination.previous')}
              </span>
            )}

            <div className="flex flex-wrap items-center justify-center gap-1 px-2">
              {visiblePages.map((p, idx) => {
                const prev = visiblePages[idx - 1];
                const ellipsis = prev !== undefined && p - prev > 1;
                return (
                  <Fragment key={p}>
                    {ellipsis ? (
                      <span className="px-2 text-[#3D1F10]/35" aria-hidden>
                        …
                      </span>
                    ) : null}
                    <Link
                      href={blogHref(tag, p)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-full text-sm font-medium transition ${
                        p === safePage
                          ? 'bg-[#8B3A1E] text-[#F5F0E6]'
                          : 'text-[#3D1F10]/70 hover:bg-[#EDE4D3]/80'
                      }`}
                      aria-current={p === safePage ? 'page' : undefined}
                    >
                      {p}
                    </Link>
                  </Fragment>
                );
              })}
            </div>

            {safePage < totalPages ? (
              <Link
                href={blogHref(tag, safePage + 1)}
                className="min-h-10 rounded-full px-4 py-2 text-sm text-[#3D1F10]/70 transition hover:text-[#8B3A1E]"
              >
                {t('pagination.next')}
              </Link>
            ) : (
              <span className="min-h-10 px-4 py-2 text-sm text-[#3D1F10]/25">
                {t('pagination.next')}
              </span>
            )}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
  reduce,
}: {
  href: string;
  active: boolean;
  label: string;
  reduce: boolean | null;
}) {
  return (
    <Link href={href} scroll={!reduce}>
      <motion.span
        layout={!reduce}
        className={`inline-flex shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
          active
            ? 'bg-[#8B3A1E] text-[#F5F0E6]'
            : 'bg-white/60 text-[#3D1F10]/80 ring-1 ring-[#EDE4D3] hover:bg-white hover:text-[#8B3A1E]'
        }`}
      >
        {label}
      </motion.span>
    </Link>
  );
}
