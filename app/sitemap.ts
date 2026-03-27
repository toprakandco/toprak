import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SERVICE_SLUGS } from '@/lib/service-slugs';
import { createSupabaseClient } from '@/lib/supabase';

function baseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

const staticSegments = ['', 'about', 'blog', 'contact', 'portfolio', 'services', 'sss'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const seg of staticSegments) {
      const path = seg ? `/${locale}/${seg}` : `/${locale}`;
      entries.push({
        url: `${base}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: seg === '' ? 1 : 0.8,
      });
    }
    for (const slug of SERVICE_SLUGS) {
      entries.push({
        url: `${base}/${locale}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  try {
    const db = createSupabaseClient();
    const [blogRes, portfolioRes] = await Promise.all([
      db.from('blog_posts').select('slug, published_at').eq('is_published', true),
      db.from('portfolio_items').select('slug, created_at').eq('is_active', true),
    ]);

    for (const locale of routing.locales) {
      for (const row of blogRes.data ?? []) {
        entries.push({
          url: `${base}/${locale}/blog/${row.slug}`,
          lastModified: row.published_at
            ? new Date(row.published_at)
            : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
      for (const row of portfolioRes.data ?? []) {
        entries.push({
          url: `${base}/${locale}/portfolio/${row.slug}`,
          lastModified: row.created_at ? new Date(row.created_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  } catch {
    /* Supabase env yoksa veya ağ hatası: yalnızca statik URL’ler */
  }

  return entries;
}
