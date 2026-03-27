'use server';

import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createClientRow(input: {
  name: string;
  logo_url: string | null;
  website_url: string | null;
  order_index: number;
  is_active: boolean;
}) {
  const db = createSupabaseClient();
  await db.from('clients').insert({
    name: input.name,
    logo_url: input.logo_url || null,
    website_url: input.website_url || null,
    order_index: input.order_index,
    is_active: input.is_active,
  });
  revalidatePath('/admin/clients');
}

export async function setClientActive(id: string, value: boolean) {
  const db = createSupabaseClient();
  await db.from('clients').update({ is_active: value }).eq('id', id);
  revalidatePath('/admin/clients');
}

export async function deleteClientRow(id: string) {
  const db = createSupabaseClient();
  await db.from('clients').delete().eq('id', id);
  revalidatePath('/admin/clients');
}
