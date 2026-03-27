import { createSupabaseClient } from '@/lib/supabase';

export async function getUnreadContactsCount(): Promise<number> {
  try {
    const db = createSupabaseClient();
    const { count, error } = await db
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
