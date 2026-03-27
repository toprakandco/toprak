'use server';

import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { SITE_SETTING_KEYS } from './settings-keys';

export async function saveSiteSettings(
  _prev: { ok?: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  try {
    const db = createSupabaseClient();
    const payload = SITE_SETTING_KEYS.map((key) => ({
      key,
      value: String(formData.get(key) ?? ''),
    }));
    await db.from('site_settings').upsert(payload, { onConflict: 'key' });
    revalidatePath('/admin/settings');
    revalidatePath('/tr', 'layout');
    revalidatePath('/en', 'layout');
    return { ok: true };
  } catch {
    return { error: 'Kayıt başarısız.' };
  }
}
