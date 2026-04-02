'use client';

import { Link } from '@/i18n/navigation';
import { getBlogCardExcerpt } from '@/lib/blog-utils';
import { blogPostTitle } from '@/lib/cms-localization';
import type { BlogPost } from '@/types';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

type Props = {
  title: string;
  overline: string;
  readMore: string;
  tagFallback: string;
  posts: BlogPost[];
};

function formatDate(iso: string | null, locale: string) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function HomeBlogGrid({
  title,
  overline,
  readMore,
  tagFallback,
  posts,
}: Props) {
  const reduce = useReducedMotion();
  const locale = useLocale();
  const tPh = useTranslations('home.blogSection');

  const slots: Array<{ kind: 'post'; post: BlogPost } | { kind: 'ph'; key: '1' | '2' | '3' }> = [];
  for (let i = 0; i < 3; i++) {
    const post = posts[i];
    if (post) slots.push({ kind: 'post', post });
    else slots.push({ kind: 'ph', key: String(i + 1) as '1' | '2' | '3' });
  }

  return (
    <section className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 bg-white py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-[max(24px,5vw)]">
        <p className="text-center text-xs font-medium uppercase tracking-[0.35em] text-terracotta">
          {overline}
        </p>
        <h2 className="mt-4 text-center font-serif text-[clamp(24px,4vw,48px)] text-brown-deep">{title}</h2>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot, i) => (
            <motion.article
              key={slot.kind === 'post' ? slot.post.id : `ph-${slot.key}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ delay: 0.1 * i, duration: 0.45 }}
              className="flex flex-col rounded-2xl border border-beige bg-cream/40 p-6 shadow-sm"
            >
              {slot.kind === 'post' ? (
                <>
                  <p className="text-xs uppercase tracking-wider text-brown-deep/50">
                    {formatDate(slot.post.published_at, locale)}
                  </p>
                  <h3 className="mt-3 font-serif text-xl text-brown-deep">
                    {blogPostTitle(slot.post, locale)}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-brown-deep/75">
                    {getBlogCardExcerpt(slot.post, locale)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(slot.post.tags?.[0] ? [slot.post.tags[0]] : [tagFallback]).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-beige px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brown-deep/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${slot.post.slug}`}
                    className="mt-6 inline-flex text-sm font-medium text-terracotta"
                  >
                    {readMore}
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-wider text-brown-deep/45">
                    {tPh(`placeholder${slot.key}.date`)}
                  </p>
                  <h3 className="mt-3 font-serif text-xl text-brown-deep/80">
                    {tPh(`placeholder${slot.key}.title`)}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm text-brown-deep/65">
                    {tPh(`placeholder${slot.key}.excerpt`)}
                  </p>
                  <span className="mt-4 inline-flex text-sm text-terracotta/70">{readMore}</span>
                </>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
