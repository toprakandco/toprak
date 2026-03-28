import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import type {
  BlogPost,
  PortfolioItem,
  Service,
} from '@/types';

export type { Database };

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  return { url, anonKey };
}

export function createSupabaseClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
    );
  }

  return createClient(url, anonKey);
}

export const supabase = createSupabaseClient();

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPortfolioItems(
  category?: string,
  limit?: number,
): Promise<PortfolioItem[]> {
  let query = supabase
    .from('portfolio_items')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }
  if (limit != null) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/** Slugs for static generation; falls back when env or query fails. */
export async function getActiveServiceSlugs(): Promise<string[]> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return [];
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('services')
    .select('slug')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error || !data?.length) {
    return [];
  }
  return (data as { slug: string }[]).map((row) => row.slug);
}

export async function getServiceBySlugSafe(slug: string): Promise<Service | null> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return null;
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    return null;
  }
  return data as Service | null;
}

export async function getServicesSafe(): Promise<Service[]> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return [];
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    return [];
  }
  return (data ?? []) as Service[];
}

export async function getPortfolioItemsSafe(
  category?: string,
  limit?: number,
): Promise<PortfolioItem[]> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return [];
  }

  const client = createClient(url, anonKey);
  let query = client
    .from('portfolio_items')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }
  if (limit != null) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    return [];
  }
  return (data ?? []) as PortfolioItem[];
}

export async function getPortfolioItemBySlug(
  slug: string,
): Promise<PortfolioItem | null> {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getPortfolioItemBySlugSafe(
  slug: string,
): Promise<PortfolioItem | null> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return null;
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('portfolio_items')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    return null;
  }
  return data as PortfolioItem | null;
}

export async function getActivePortfolioSlugs(): Promise<string[]> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return [];
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('portfolio_items')
    .select('slug')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error || !data?.length) {
    return [];
  }
  return (data as { slug: string }[]).map((r) => r.slug);
}

export async function getRelatedPortfolioItemsSafe(
  category: string | null,
  excludeSlug: string,
  limit = 3,
): Promise<PortfolioItem[]> {
  if (!category) {
    return [];
  }

  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return [];
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('portfolio_items')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .neq('slug', excludeSlug)
    .order('order_index', { ascending: true })
    .limit(limit);

  if (error) {
    return [];
  }
  return (data ?? []) as PortfolioItem[];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...(row as BlogPost),
    is_featured: Boolean((row as BlogPost).is_featured),
  }));
}

/** Does not throw if env is missing or the query fails — for public homepage. */
export async function getLatestBlogPostsForHome(
  limit = 3,
): Promise<BlogPost[]> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return [];
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }
  return (data ?? []).map((row) => ({
    ...(row as BlogPost),
    is_featured: Boolean((row as BlogPost).is_featured),
  }));
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw error;
  const row = data as BlogPost | null;
  if (!row) return null;
  return { ...row, is_featured: Boolean(row.is_featured) };
}

export async function getBlogPostsSafe(): Promise<BlogPost[]> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return [];
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    return [];
  }
  return (data ?? []).map((row) => ({
    ...(row as BlogPost),
    is_featured: Boolean((row as BlogPost).is_featured),
  }));
}

export async function getBlogPostBySlugSafe(
  slug: string,
): Promise<BlogPost | null> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return null;
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    return null;
  }
  const row = data as BlogPost | null;
  if (!row) return null;
  return { ...row, is_featured: Boolean(row.is_featured) };
}

export async function getActiveBlogSlugs(): Promise<string[]> {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return [];
  }

  const client = createClient(url, anonKey);
  const { data, error } = await client
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error || !data?.length) {
    return [];
  }
  return (data as { slug: string }[]).map((r) => r.slug);
}

export async function getRelatedBlogPostsByTags(
  excludeSlug: string,
  tags: string[],
  limit = 3,
): Promise<BlogPost[]> {
  if (!tags.length) {
    return [];
  }

  const all = await getBlogPostsSafe();
  const scored = all
    .filter((p) => p.slug !== excludeSlug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const ta = a.post.published_at
        ? new Date(a.post.published_at).getTime()
        : 0;
      const tb = b.post.published_at
        ? new Date(b.post.published_at).getTime()
        : 0;
      return tb - ta;
    });

  return scored.slice(0, limit).map((x) => x.post);
}
