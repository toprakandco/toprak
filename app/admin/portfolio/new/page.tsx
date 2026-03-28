import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PortfolioEditor } from '../PortfolioEditor';

function toList(v: FormDataEntryValue | null) {
  return String(v ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function NewPortfolioPage() {
  async function createItem(formData: FormData) {
    'use server';
    const db = createSupabaseClient();

    await db.from('portfolio_items').insert({
      title_tr: String(formData.get('title_tr') ?? ''),
      title_en: String(formData.get('title_en') ?? ''),
      slug: String(formData.get('slug') ?? ''),
      description_tr: String(formData.get('description_tr') ?? '') || null,
      description_en: String(formData.get('description_en') ?? '') || null,
      category: String(formData.get('category') ?? '') || null,
      cover_image: String(formData.get('cover_image') ?? '') || null,
      before_image: String(formData.get('before_image') ?? '') || null,
      after_image: String(formData.get('after_image') ?? '') || null,
      images: toList(formData.get('images')),
      tags: toList(formData.get('tags')),
      is_featured: Boolean(formData.get('is_featured')),
      is_active: Boolean(formData.get('is_active')),
      order_index: Number(formData.get('order_index') ?? 0),
    });

    revalidatePath('/admin/portfolio');
    redirect('/admin/portfolio');
  }

  return (
    <div className="space-y-4">
      <p className="font-sans text-sm text-[#6B4C35]">Yeni portfolyo öğesi oluşturun.</p>
      <PortfolioEditor initial={null} saveAction={createItem} submitLabel="Kaydet" />
    </div>
  );
}
