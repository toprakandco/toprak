import { createServiceSupabaseClient } from '@/lib/supabase-service';

export async function getUnreadApplicationsCount(): Promise<number> {
  try {
    const db = createServiceSupabaseClient();
    const { count, error } = await db
      .from('project_applications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
