import { createSupabaseClient } from '@/lib/supabase';
import { SITE_SETTING_KEYS, type SiteSettingKey } from './settings-keys';
import { SettingsFormClient } from './SettingsFormClient';

export default async function AdminSettingsPage() {
  const db = createSupabaseClient();
  const { data } = await db.from('site_settings').select('*');
  const map = new Map((data ?? []).map((x) => [x.key, x.value]));

  const initial = Object.fromEntries(
    SITE_SETTING_KEYS.map((k) => [k, map.get(k) ?? '']),
  ) as Record<SiteSettingKey, string>;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-brown-deep">Site Ayarları</h1>
      <SettingsFormClient initial={initial} />
    </div>
  );
}
