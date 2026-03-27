import type { BlogPost } from '@/types';

const WORDS_PER_MINUTE = 200;

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function estimateReadingMinutes(html: string): number {
  const text = stripHtml(html);
  if (!text) return 1;
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  return Math.max(1, minutes);
}

export function formatBlogDate(iso: string | null, locale: string): string {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function sortBlogPostsForListing(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    if (Boolean(a.is_featured) !== Boolean(b.is_featured)) {
      return b.is_featured ? 1 : -1;
    }
    const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
    const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
    return tb - ta;
  });
}

export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  if (!tag || tag === 'all') return posts;
  return posts.filter((p) => p.tags?.includes(tag));
}

export const BLOG_POSTS_PER_PAGE = 9;

export function getBlogCardExcerpt(post: BlogPost, locale: string): string {
  const excerptRaw =
    locale === 'tr' ? post.excerpt_tr : post.excerpt_en;
  if (excerptRaw && excerptRaw.trim().length > 0) {
    return excerptRaw.trim();
  }
  const content = locale === 'tr' ? post.content_tr : post.content_en;
  return `${stripHtml(content).slice(0, 180)}…`;
}
