import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { BlogForm } from '../../BlogForm';

type Props = {
  params: Promise<{ id: string }>;
};

function toTags(v: FormDataEntryValue | null) {
  return String(v ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const db = createSupabaseClient();
  const { data } = await db.from('blog_posts').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  async function updatePost(formData: FormData) {
    'use server';
    const dbAction = createSupabaseClient();
    const publishedAt = String(formData.get('published_at') ?? '');

    await dbAction
      .from('blog_posts')
      .update({
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
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      })
      .eq('id', id);

    revalidatePath('/admin/blog');
    redirect('/admin/blog');
  }

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-brown-deep">Blog Yazısı Düzenle</h1>
      <BlogForm initial={data} action={updatePost} submitLabel="Güncelle" />
    </div>
  );
}
