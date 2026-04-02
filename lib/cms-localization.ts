import type { BlogPost, PortfolioItem, Service } from '@/types';

function pickWithEnFallback(
  locale: string,
  tr: string,
  en: string,
  de: string | null | undefined,
  fr: string | null | undefined,
): string {
  if (locale === 'tr') return tr;
  if (locale === 'de') return (de?.trim() ? de : en) ?? '';
  if (locale === 'fr') return (fr?.trim() ? fr : en) ?? '';
  return en ?? '';
}

function pickDescWithEnFallback(
  locale: string,
  tr: string | null | undefined,
  en: string | null | undefined,
  de: string | null | undefined,
  fr: string | null | undefined,
): string {
  const t = tr ?? '';
  const e = en ?? '';
  if (locale === 'tr') return t;
  if (locale === 'de') return (de?.trim() ? de : e) ?? '';
  if (locale === 'fr') return (fr?.trim() ? fr : e) ?? '';
  return e;
}

/** Service title for public UI (de/fr fall back to EN). */
export function localizedServiceTitle(s: Service, locale: string): string {
  return pickWithEnFallback(
    locale,
    s.title_tr,
    s.title_en,
    s.title_de,
    s.title_fr,
  );
}

/** Service description for public UI. */
export function localizedServiceDescription(s: Service, locale: string): string {
  return pickDescWithEnFallback(
    locale,
    s.description_tr,
    s.description_en,
    s.description_de,
    s.description_fr,
  );
}

export function localizedPortfolioTitle(
  item: PortfolioItem,
  locale: string,
): string {
  return pickWithEnFallback(
    locale,
    item.title_tr,
    item.title_en,
    item.title_de,
    item.title_fr,
  );
}

export function localizedPortfolioDescription(
  item: PortfolioItem,
  locale: string,
): string {
  return pickDescWithEnFallback(
    locale,
    item.description_tr,
    item.description_en,
    item.description_de,
    item.description_fr,
  );
}

export function blogPostTitle(post: BlogPost, locale: string): string {
  return pickWithEnFallback(
    locale,
    post.title_tr,
    post.title_en,
    post.title_de,
    post.title_fr,
  );
}

export function blogPostContent(post: BlogPost, locale: string): string {
  return pickWithEnFallback(
    locale,
    post.content_tr,
    post.content_en,
    post.content_de,
    post.content_fr,
  );
}

export function blogPostExcerpt(
  post: BlogPost,
  locale: string,
): string | null {
  const tr = post.excerpt_tr;
  const en = post.excerpt_en;
  const de = post.excerpt_de;
  const fr = post.excerpt_fr;
  if (locale === 'tr') return tr?.trim() ? tr : null;
  if (locale === 'de') {
    const v = de?.trim() ? de : en?.trim() ? en : null;
    return v ?? null;
  }
  if (locale === 'fr') {
    const v = fr?.trim() ? fr : en?.trim() ? en : null;
    return v ?? null;
  }
  return en?.trim() ? en : null;
}
