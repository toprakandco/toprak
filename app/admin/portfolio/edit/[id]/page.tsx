import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { PortfolioForm } from '../../PortfolioForm';

type Props = {
  params: Promise<{ id: string }>;
};

function toList(v: FormDataEntryValue | null) {
  return String(v ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default async function EditPortfolioPage({ params }: Props) {
  const { id } = await params;
  const db = createSupabaseClient();
  const { data } = await db.from('portfolio_items').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  async function updateItem(formData: FormData) {
    'use server';
    const dbAction = createSupabaseClient();
    await dbAction
      .from('portfolio_items')
      .update({
        title_tr: String(formData.get('title_tr') ?? ''),
        title_en: String(formData.get('title_en') ?? ''),
        slug: String(formData.get('slug') ?? ''),
        description_tr: String(formData.get('description_tr') ?? ''),
        description_en: String(formData.get('description_en') ?? ''),
        category: String(formData.get('category') ?? '') || null,
        cover_image: String(formData.get('cover_image') ?? '') || null,
        images: toList(formData.get('images')),
        tags: toList(formData.get('tags')),
        is_featured: Boolean(formData.get('is_featured')),
        is_active: Boolean(formData.get('is_active')),
        order_index: Number(formData.get('order_index') ?? 0),
      })
      .eq('id', id);

    revalidatePath('/admin/portfolio');
    redirect('/admin/portfolio');
  }

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-brown-deep">Portfolyo Düzenle</h1>
      <PortfolioForm initial={data} action={updateItem} submitLabel="Güncelle" />
    </div>
  );
}
