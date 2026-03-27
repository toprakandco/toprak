import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const settingFields = [
  { key: 'site_title_tr', label: 'Site Başlığı (TR)' },
  { key: 'site_title_en', label: 'Site Title (EN)' },
  { key: 'meta_description_tr', label: 'Meta Açıklama (TR)' },
  { key: 'meta_description_en', label: 'Meta Description (EN)' },
  { key: 'contact_email', label: 'Contact Email' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'youtube_url', label: 'YouTube URL' },
  { key: 'linkedin_url', label: 'LinkedIn URL' },
  { key: 'hero_heading_tr', label: 'Hero Heading (TR)' },
  { key: 'hero_heading_en', label: 'Hero Heading (EN)' },
] as const;

export default async function AdminSettingsPage() {
  const db = createSupabaseClient();
  const { data } = await db.from('site_settings').select('*');
  const map = new Map((data ?? []).map((x) => [x.key, x.value]));

  async function saveSettings(formData: FormData) {
    'use server';
    const dbAction = createSupabaseClient();
    const payload = settingFields.map((f) => ({
      key: f.key,
      value: String(formData.get(f.key) ?? ''),
    }));
    await dbAction.from('site_settings').upsert(payload, { onConflict: 'key' });
    revalidatePath('/admin/settings');
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-brown-deep">Site Ayarları</h1>

      <form action={saveSettings} className="rounded-xl border border-beige bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {settingFields.map((field) => (
            <label key={field.key} className="space-y-1">
              <span className="text-sm">{field.label}</span>
              <input
                name={field.key}
                defaultValue={map.get(field.key) ?? ''}
                className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-terracotta px-5 text-sm font-medium text-cream transition hover:bg-terracotta-dark"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
