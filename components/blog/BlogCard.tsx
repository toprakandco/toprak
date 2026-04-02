import { Link } from '@/i18n/navigation';
import {
  blogPostContent,
  blogPostExcerpt,
  blogPostTitle,
} from '@/lib/cms-localization';
import { formatBlogDate } from '@/lib/blog-utils';
import type { BlogPost } from '@/types';
import Image from 'next/image';

type Props = {
  post: BlogPost;
  locale: string;
  featured: boolean;
  readMoreLabel: string;
  readShortLabel: string;
};

export function BlogCard({
  post,
  locale,
  featured,
  readMoreLabel,
  readShortLabel,
}: Props) {
  const title = blogPostTitle(post, locale);
  const excerptRaw = blogPostExcerpt(post, locale);
  const content = blogPostContent(post, locale);
  const excerpt =
    excerptRaw && excerptRaw.trim().length > 0
      ? excerptRaw
      : stripHtml(content).slice(0, 180) + '…';
  const dateStr = formatBlogDate(post.published_at, locale);
  const primaryTag = post.tags?.[0] ?? '';

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative block min-h-[420px] w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-beige/60"
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={title}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            sizes="(max-width: 1200px) 100vw, 1152px"
            priority
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-terracotta via-terracotta to-terracotta-dark"
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 flex max-w-4xl flex-col gap-3 p-8 md:p-10">
          {primaryTag ? (
            <span className="inline-flex w-fit rounded-full bg-cream/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cream backdrop-blur-sm">
              {primaryTag}
            </span>
          ) : null}
          <h2 className="font-serif text-3xl leading-tight text-cream md:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
          <p className="line-clamp-2 max-w-2xl text-base text-cream/90 md:text-lg">
            {excerpt}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-cream/80">
            {dateStr ? <time dateTime={post.published_at ?? undefined}>{dateStr}</time> : null}
            <span className="font-medium text-cream transition group-hover:text-cream">
              {readMoreLabel}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-beige bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-beige">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-leaf/35"
            aria-hidden
          >
            <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none">
              <path
                d="M32 8c-6 14-4 28 4 40M20 24c8 4 16 2 24-4M12 44c12 2 22-2 32-10"
                stroke="currentColor"
                strokeWidth={1.2}
                strokeLinecap="round"
              />
              <path
                d="M28 52c4-6 10-10 18-10"
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="round"
                opacity={0.6}
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {post.tags?.length ? (
          <ul className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-leaf/12 px-2.5 py-0.5 text-xs font-medium text-leaf-dark ring-1 ring-leaf/20"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <h2 className="font-serif text-xl text-brown-deep transition-colors group-hover:text-terracotta md:text-[1.35rem]">
          {title}
        </h2>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-brown-deep/75">
          {excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-beige/80 pt-4 text-xs text-brown-deep/50">
          {dateStr ? (
            <time dateTime={post.published_at ?? undefined}>{dateStr}</time>
          ) : (
            <span />
          )}
          <span className="font-semibold text-terracotta">{readShortLabel}</span>
        </div>
      </div>
    </Link>
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
