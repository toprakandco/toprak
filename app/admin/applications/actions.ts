'use server';

import { createServiceSupabaseClient } from '@/lib/supabase-service';
import { revalidatePath } from 'next/cache';

export async function markProjectApplicationRead(id: string) {
  const db = createServiceSupabaseClient();
  await db.from('project_applications').update({ is_read: true }).eq('id', id);
  revalidatePath('/admin/applications');
}

export async function markProjectApplicationUnread(id: string) {
  const db = createServiceSupabaseClient();
  await db.from('project_applications').update({ is_read: false }).eq('id', id);
  revalidatePath('/admin/applications');
}

export async function deleteProjectApplication(id: string) {
  const db = createServiceSupabaseClient();
  await db.from('project_applications').delete().eq('id', id);
  revalidatePath('/admin/applications');
}
