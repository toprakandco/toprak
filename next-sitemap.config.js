/** @type {import('next-sitemap').IConfig} */

const SERVICE_SLUGS = [
  'grafik-tasarim',
  'ceviri',
  'seslendirme',
  'icerik-uretimi',
  'fotograf-video',
  'web-yazilim',
];

const LOCALES = ['tr', 'en'];
const STATIC_SEGMENTS = [
  '',
  'about',
  'blog',
  'contact',
  'kvkk',
  'portfolio',
  'services',
  'start',
  'sss',
];

module.exports = {
  siteUrl: 'https://toprakco.tr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
  exclude: ['/admin/*', '/api/*'],
  additionalPaths: async () => {
    const result = [];

    for (const locale of LOCALES) {
      for (const seg of STATIC_SEGMENTS) {
        const loc = seg ? `/${locale}/${seg}` : `/${locale}`;
        result.push({
          loc,
          changefreq: seg === '' ? 'weekly' : 'weekly',
          priority: seg === '' ? 1 : 0.8,
        });
      }
      for (const slug of SERVICE_SLUGS) {
        result.push({
          loc: `/${locale}/services/${slug}`,
          changefreq: 'monthly',
          priority: 0.7,
        });
      }
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
      if (!url || !key) return result;

      const db = createClient(url, key);
      const [blogRes, portfolioRes] = await Promise.all([
        db.from('blog_posts').select('slug, published_at').eq('is_published', true),
        db.from('portfolio_items').select('slug, created_at').eq('is_active', true),
      ]);

      for (const locale of LOCALES) {
        for (const row of blogRes.data ?? []) {
          result.push({
            loc: `/${locale}/blog/${row.slug}`,
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: row.published_at
              ? new Date(row.published_at).toISOString()
              : undefined,
          });
        }
        for (const row of portfolioRes.data ?? []) {
          result.push({
            loc: `/${locale}/portfolio/${row.slug}`,
            changefreq: 'monthly',
            priority: 0.7,
            lastmod: row.created_at
              ? new Date(row.created_at).toISOString()
              : undefined,
          });
        }
      }
    } catch (e) {
      console.warn('[next-sitemap] Supabase additional paths skipped:', e);
    }

    return result;
  },
};
