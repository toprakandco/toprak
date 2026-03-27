'use server';

import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function deletePortfolioItem(id: string) {
  const db = createSupabaseClient();
  await db.from('portfolio_items').delete().eq('id', id);
  revalidatePath('/admin/portfolio');
}

export async function setPortfolioToggle(
  id: string,
  field: 'is_featured' | 'is_active',
  value: boolean,
) {
  const db = createSupabaseClient();
  await db.from('portfolio_items').update({ [field]: value }).eq('id', id);
  revalidatePath('/admin/portfolio');
}

export async function reorderPortfolioItem(
  id: string,
  direction: 'up' | 'down',
) {
  const db = createSupabaseClient();
  const { data: rows } = await db
    .from('portfolio_items')
    .select('id, order_index')
    .order('order_index', { ascending: true });

  const list = rows ?? [];
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return;

  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= list.length) return;

  const a = list[idx];
  const b = list[swapIdx];
  const oa = a.order_index;
  const ob = b.order_index;

  await db.from('portfolio_items').update({ order_index: ob }).eq('id', a.id);
  await db.from('portfolio_items').update({ order_index: oa }).eq('id', b.id);
  revalidatePath('/admin/portfolio');
}
