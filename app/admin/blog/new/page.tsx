import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BlogForm } from '../BlogForm';

function toTags(v: FormDataEntryValue | null) {
  return String(v ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function NewBlogPostPage() {
  async function createPost(formData: FormData) {
    'use server';
    const db = createSupabaseClient();
    const publishedAt = String(formData.get('published_at') ?? '');

    await db.from('blog_posts').insert({
      title_tr: String(formData.get('title_tr') ?? ''),
      title_en: String(formData.get('title_en') ?? ''),
      slug: String(formData.get('slug') ?? ''),
      excerpt_tr: String(formData.get('excerpt_tr') ?? '') || null,
      excerpt_en: String(formData.get('excerpt_en') ?? '') || null,
      content_tr: String(formData.get('content_tr') ?? ''),
      content_en: String(formData.get('content_en') ?? ''),
      cover_image: String(formData.get('cover_image') ?? '') || null,
      tags: toTags(formData.get('tags')),
      is_published: Boolean(formData.get('is_published')),
      is_featured: false,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
    });

    revalidatePath('/admin/blog');
    redirect('/admin/blog');
  }

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-brown-deep">Yeni Blog Yazısı</h1>
      <BlogForm action={createPost} submitLabel="Kaydet" />
    </div>
  );
}
