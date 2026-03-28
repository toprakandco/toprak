'use server';

import { createServiceSupabaseClient } from '@/lib/supabase-service';
import { revalidatePath } from 'next/cache';

export async function setCallbackRequestCalled(id: string, is_called: boolean) {
  const db = createServiceSupabaseClient();
  await db.from('callback_requests').update({ is_called }).eq('id', id);
  revalidatePath('/admin/contacts');
}
