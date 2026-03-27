'use server';

import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function markContactRead(id: string) {
  const db = createSupabaseClient();
  await db.from('contacts').update({ is_read: true }).eq('id', id);
  revalidatePath('/admin/contacts');
}

export async function markContactUnread(id: string) {
  const db = createSupabaseClient();
  await db.from('contacts').update({ is_read: false }).eq('id', id);
  revalidatePath('/admin/contacts');
}

export async function deleteContactRow(id: string) {
  const db = createSupabaseClient();
  await db.from('contacts').delete().eq('id', id);
  revalidatePath('/admin/contacts');
}
