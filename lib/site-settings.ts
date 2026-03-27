import { createSupabaseClient } from '@/lib/supabase';

export async function getSiteSettingsMapSafe(): Promise<Map<string, string>> {
  try {
    const db = createSupabaseClient();
    const { data, error } = await db.from('site_settings').select('key, value');
    if (error) return new Map();
    return new Map((data ?? []).map((r) => [r.key, r.value ?? '']));
  } catch {
    return new Map();
  }
}
