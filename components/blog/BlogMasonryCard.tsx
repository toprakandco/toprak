'use client';

import {
  estimateReadingMinutes,
  formatBlogDate,
  getBlogCardExcerpt,
} from '@/lib/blog-utils';
import { Link } from '@/i18n/navigation';
import type { BlogPost } from '@/types';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  post: BlogPost;
  locale: string;
  styleVariant: 0 | 1 | 2;
  motionIndex: number;
  readShort: string;
  readTimeLabel: (mins: number) => string;
};

function LeafWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      aria-hidden
    >
      <path
        d="M60 100V40M60 72c-24-14-38-32-42-56M60 58c18-11 32-28 36-50"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <path
        d="M36 52c-10 18-4 38 14 48 14-10 24-24 24-44-14-10-28-10-38-4z"
        fill="currentColor"
        opacity={0.35}
      />
    </svg>
  );
}

export function BlogMasonryCard({
  post,
  locale,
  styleVariant,
  motionIndex,
  readShort,
  readTimeLabel,
}: Props) {
  const reduce = useReducedMotion();
  const title = locale === 'tr' ? post.title_tr : post.title_en;
  const content = locale === 'tr' ? post.content_tr : post.content_en;
  const excerpt = getBlogCardExcerpt(post, locale);
  const dateStr = formatBlogDate(post.published_at, locale);
  const mins = estimateReadingMinutes(content);

  const baseMotion = {
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: reduce ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-24px' },
    transition: {
      delay: reduce ? 0 : motionIndex * 0.08,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };

  if (styleVariant === 1) {
    return (
      <motion.div {...baseMotion} className="break-inside-avoid">
        <Link
          href={`/blog/${post.slug}`}
          className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-[16px] bg-[#3D1F10] p-6 transition-colors duration-300 hover:-translate-y-1 hover:bg-[#6B2C14] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:min-h-[320px] md:p-7"
        >
          {post.cover_image ? (
            <div
              className="pointer-events-none absolute inset-0 opacity-15 transition-opacity duration-300 group-hover:opacity-20"
              aria-hidden
            >
              <Image src={post.cover_image} alt="" fill className="object-cover" sizes="400px" />
            </div>
          ) : null}
          <span
            className="pointer-events-none absolute left-4 top-2 font-serif text-[80px] leading-none text-[#8B3A1E]/30"
            aria-hidden
          >
            &ldquo;
          </span>
          <div className="relative z-[1] mt-10 flex flex-1 flex-col">
            {post.tags?.length ? (
              <ul className="mb-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-[#8B3A1E]/25 px-2.5 py-0.5 text-[11px] font-medium text-[#F5F0E6]/90"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            <h2 className="font-serif text-[20px] leading-snug text-[#F5F0E6]">{title}</h2>
            <p className="mt-3 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[#F5F0E6]/60">
              {excerpt}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#F5F0E6]/10 pt-4 text-xs text-[#F5F0E6]/45">
              {dateStr ? <time dateTime={post.published_at ?? undefined}>{dateStr}</time> : <span />}
              <span className="font-semibold text-[#C4824A]">{readShort}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (styleVariant === 2) {
    return (
      <motion.div {...baseMotion} className="break-inside-avoid">
        <Link
          href={`/blog/${post.slug}`}
          className="group flex min-h-[200px] overflow-hidden rounded-[16px] border border-[#C0DD97] bg-[#EAF3DE] transition-all duration-300 hover:-translate-y-1 hover:border-[#7A9E6E] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          style={{ borderWidth: '0.5px' }}
        >
          {post.cover_image ? (
            <div className="relative min-h-[200px] w-[60px] shrink-0 self-stretch overflow-hidden">
              <Image
                src={post.cover_image}
                alt=""
                fill
                className="object-cover"
                sizes="60px"
              />
            </div>
          ) : (
            <div className="flex min-h-[200px] w-[60px] shrink-0 items-center justify-center self-stretch text-[#7A9E6E]/20">
              <LeafWatermark className="h-24 w-16" />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col p-6">
            {post.tags?.length ? (
              <ul className="mb-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-[#5C7A52]/18 px-2.5 py-0.5 text-[11px] font-medium text-[#3D1F10]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
            <h2 className="font-serif text-[20px] leading-snug text-[#3D1F10]">{title}</h2>
            <p className="mt-3 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[#5C7A52]">
              {excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#5C7A52]/75">
              {dateStr ? <time dateTime={post.published_at ?? undefined}>{dateStr}</time> : <span />}
              <span className="font-semibold text-[#5C7A52]">{readShort}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  /* Style A — classic */
  return (
    <motion.div {...baseMotion} className="break-inside-avoid">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col overflow-hidden rounded-[16px] border border-[#EDE4D3] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        style={{ borderWidth: '0.5px' }}
      >
        <div className="relative h-[200px] w-full shrink-0 overflow-hidden rounded-t-[16px] bg-[#F5F0E6]">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#7A9E6E]/25">
              <LeafWatermark className="h-20 w-20" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          {post.tags?.length ? (
            <ul className="mb-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-[#7A9E6E]/15 px-2.5 py-0.5 text-[11px] font-medium text-[#3D1F10]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <h2 className="font-serif text-[20px] leading-snug text-[#3D1F10]">{title}</h2>
          <p className="mt-3 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[#3D1F10]/55">
            {excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EDE4D3]/80 pt-4 text-xs text-[#3D1F10]/45">
            <span className="flex flex-wrap items-center gap-2">
              {dateStr ? <time dateTime={post.published_at ?? undefined}>{dateStr}</time> : null}
              <span className="text-[#3D1F10]/30" aria-hidden>
                ·
              </span>
              <span>{readTimeLabel(mins)}</span>
            </span>
            <span className="font-semibold text-[#8B3A1E]">{readShort}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
