import { createSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import { BlogListClient } from './BlogListClient';

export default async function AdminBlogPage() {
  const db = createSupabaseClient();
  const { data } = await db
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-brown-deep">Blog Yönetimi</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-terracotta px-4 text-sm text-cream transition hover:bg-terracotta-dark"
        >
          Yeni Yazı
        </Link>
      </div>

      <BlogListClient posts={rows} />
    </div>
  );
}
