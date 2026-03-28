import type { Metadata } from 'next';

export const SITE_URL = 'https://toprakco.tr';

/**
 * Open Graph + Twitter card fields for public pages.
 * `pathname` is the path after locale, e.g. `/about`, `/blog/post-slug`, or `` for home.
 */
export function socialMetadata(
  locale: string,
  title: string,
  description: string,
  pathname: string,
): Pick<Metadata, 'openGraph' | 'twitter'> {
  const path =
    pathname === '' || pathname === '/'
      ? `/${locale}`
      : `/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
  const url = `${SITE_URL}${path}`;
  const imagePath = `/${locale}/opengraph-image`;
  const imageUrl = `${SITE_URL}${imagePath}`;
  const ogLocale = locale === 'tr' ? 'tr_TR' : 'en_US';

  return {
    openGraph: {
      title,
      description,
      url,
      siteName: 'Toprak & Co.',
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@toprakcotr',
    },
  };
}
