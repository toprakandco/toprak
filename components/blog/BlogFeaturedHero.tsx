'use client';

import {
  estimateReadingMinutes,
  formatBlogDate,
  stripHtml,
} from '@/lib/blog-utils';
import { Link } from '@/i18n/navigation';
import type { BlogPost } from '@/types';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  post: BlogPost;
  locale: string;
  badge: string;
  readMore: string;
  readTimeLabel: (mins: number) => string;
};

function LogoMark() {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-8">
      <Image
        src="/photos/LOGO.png"
        alt=""
        width={140}
        height={56}
        className="h-auto w-[min(45%,140px)] opacity-90"
      />
    </div>
  );
}

export function BlogFeaturedHero({
  post,
  locale,
  badge,
  readMore,
  readTimeLabel,
}: Props) {
  const reduce = useReducedMotion();
  const title = locale === 'tr' ? post.title_tr : post.title_en;
  const excerptRaw = locale === 'tr' ? post.excerpt_tr : post.excerpt_en;
  const content = locale === 'tr' ? post.content_tr : post.content_en;
  const excerpt =
    excerptRaw?.trim() ||
    `${stripHtml(content).slice(0, 220)}…`;
  const dateStr = formatBlogDate(post.published_at, locale);
  const mins = estimateReadingMinutes(content);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 60 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex min-h-[480px] flex-col overflow-hidden rounded-[20px] md:min-h-[480px] md:flex-row"
      >
        <div
          className="flex w-full flex-shrink-0 flex-col justify-center md:w-[55%] md:max-w-[55%]"
          style={{ backgroundColor: '#3D1F10', padding: '52px' }}
        >
          <span
            className="mb-5 inline-flex w-fit rounded-full bg-[#C4824A] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#F5F0E6]"
          >
            {badge}
          </span>
          <h2
            className="font-serif text-[#F5F0E6] transition-colors duration-300 group-hover:text-[#C4824A]"
            style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}
          >
            {title}
          </h2>
          <p
            className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-[#F5F0E6]/70"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            {excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#F5F0E6]/55">
            {dateStr ? <time dateTime={post.published_at ?? undefined}>{dateStr}</time> : null}
            {dateStr ? <span aria-hidden>·</span> : null}
            <span>{readTimeLabel(mins)}</span>
          </div>
          <span className="relative mt-8 inline-flex w-fit text-sm font-medium text-[#F5F0E6] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#F5F0E6] after:transition-[width] after:duration-300 group-hover:after:w-full">
            {readMore}
          </span>
        </div>

        <div className="relative h-64 w-full flex-shrink-0 overflow-hidden md:h-auto md:min-h-[480px] md:w-[45%] md:max-w-[45%]">
          {post.cover_image ? (
            <>
              <Image
                src={post.cover_image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                sizes="(max-width: 768px) 100vw, 45vw"
                priority
              />
            </>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#8B3A1E] to-[#6B2C14]"
              aria-hidden
            >
              <LogoMark />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
