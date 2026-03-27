'use server';

import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function deleteBlogPost(id: string) {
  const db = createSupabaseClient();
  await db.from('blog_posts').delete().eq('id', id);
  revalidatePath('/admin/blog');
  revalidatePath('/tr/blog');
  revalidatePath('/en/blog');
}

export async function setBlogPublished(id: string, value: boolean) {
  const db = createSupabaseClient();
  await db.from('blog_posts').update({ is_published: value }).eq('id', id);
  revalidatePath('/admin/blog');
  revalidatePath('/tr/blog');
  revalidatePath('/en/blog');
}
