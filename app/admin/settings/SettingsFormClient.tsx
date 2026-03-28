'use client';

import { saveSiteSettings } from './actions';
import type { SiteSettingKey } from './settings-keys';
import { EmailSignatureGenerator } from '@/components/admin/EmailSignatureGenerator';
import { EmailSignaturePanel } from './EmailSignaturePanel';
import { useActionState, useEffect, useState } from 'react';

type Props = {
  initial: Record<SiteSettingKey, string>;
};

function fld(
  key: SiteSettingKey,
  label: string,
  multiline?: boolean,
  placeholder?: string,
) {
  return { key, label, multiline, placeholder };
}

type SettingsTab = 'site' | 'email' | 'signatures';

export function SettingsFormClient({ initial }: Props) {
  const [state, formAction] = useActionState(saveSiteSettings, null);
  const [maintain, setMaintain] = useState(initial.maintenance_mode === 'true');
  const [showToast, setShowToast] = useState(false);
  const [tab, setTab] = useState<SettingsTab>('site');

  useEffect(() => {
    setMaintain(initial.maintenance_mode === 'true');
  }, [initial.maintenance_mode]);

  useEffect(() => {
    if (!state?.ok) return;
    setShowToast(true);
    const t = window.setTimeout(() => setShowToast(false), 4000);
    return () => window.clearTimeout(t);
  }, [state?.ok]);

  return (
    <>
      {showToast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-[#7A9E6E]/40 bg-[#EAF3DE] px-5 py-2.5 font-sans text-sm font-medium text-[#3D1F10] shadow-lg"
        >
          Ayarlar kaydedildi ✓
        </div>
      ) : null}

      {state?.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-sans text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-[#EDE4D3] pb-4">
        <button
          type="button"
          onClick={() => setTab('site')}
          className={`rounded-lg px-4 py-2 font-sans text-sm font-medium transition ${
            tab === 'site'
              ? 'bg-[#8B3A1E]/10 text-[#3D1F10] ring-1 ring-inset ring-[#8B3A1E]/30'
              : 'text-[#6B4C35] hover:bg-[#F5F0E6]'
          }`}
        >
          Site ayarları
        </button>
        <button
          type="button"
          onClick={() => setTab('email')}
          className={`rounded-lg px-4 py-2 font-sans text-sm font-medium transition ${
            tab === 'email'
              ? 'bg-[#8B3A1E]/10 text-[#3D1F10] ring-1 ring-inset ring-[#8B3A1E]/30'
              : 'text-[#6B4C35] hover:bg-[#F5F0E6]'
          }`}
        >
          E-posta İmzası Önizleme
        </button>
        <button
          type="button"
          onClick={() => setTab('signatures')}
          className={`rounded-lg px-4 py-2 font-sans text-sm font-medium transition ${
            tab === 'signatures'
              ? 'bg-[#8B3A1E]/10 text-[#3D1F10] ring-1 ring-inset ring-[#8B3A1E]/30'
              : 'text-[#6B4C35] hover:bg-[#F5F0E6]'
          }`}
        >
          E-posta İmzaları
        </button>
      </div>

      {tab === 'email' ? (
        <EmailSignaturePanel />
      ) : null}

      {tab === 'signatures' ? (
        <EmailSignatureGenerator />
      ) : null}

      <form
        action={formAction}
        className={`space-y-10 rounded-xl border border-beige bg-white p-6 shadow-sm ${tab !== 'site' ? 'hidden' : ''}`}
      >
        <input type="hidden" name="maintenance_mode" value={maintain ? 'true' : 'false'} />

        <fieldset className="space-y-4">
          <legend className="font-serif text-xl text-[#3D1F10]">Genel Bilgiler</legend>
          <div className="h-px bg-[#EDE4D3]" aria-hidden />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              fld('site_title_tr', 'Site Başlığı TR'),
              fld('site_title_en', 'Site Başlığı EN'),
              fld('meta_description_tr', 'Meta Açıklama TR', true),
              fld('meta_description_en', 'Meta Açıklama EN', true),
              fld('contact_email', 'İletişim E-postası', false, 'hello@…'),
            ].map((f) => (
              <label
                key={f.key}
                className={`space-y-1 ${f.multiline ? 'md:col-span-2' : ''}`}
              >
                <span className="font-sans text-sm text-[#6B4C35]">{f.label}</span>
                {f.multiline ? (
                  <textarea
                    name={f.key}
                    defaultValue={initial[f.key] ?? ''}
                    rows={3}
                    className="w-full resize-y rounded-lg border border-beige px-3 py-2 text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
                  />
                ) : (
                  <input
                    name={f.key}
                    type={f.key === 'contact_email' ? 'email' : 'text'}
                    defaultValue={initial[f.key] ?? ''}
                    placeholder={f.placeholder}
                    className="h-11 w-full rounded-lg border border-beige px-3 text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
                  />
                )}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-serif text-xl text-[#3D1F10]">Sosyal Medya</legend>
          <div className="h-px bg-[#EDE4D3]" aria-hidden />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              fld('instagram_url', 'Instagram bağlantısı'),
              fld('youtube_url', 'YouTube bağlantısı'),
              fld('linkedin_url', 'LinkedIn bağlantısı'),
            ].map((f) => (
              <label key={f.key} className="space-y-1">
                <span className="font-sans text-sm text-[#6B4C35]">{f.label}</span>
                <input
                  name={f.key}
                  defaultValue={initial[f.key] ?? ''}
                  className="h-11 w-full rounded-lg border border-beige px-3 text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
                />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-serif text-xl text-[#3D1F10]">Ana Sayfa</legend>
          <div className="h-px bg-[#EDE4D3]" aria-hidden />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              fld(
                'hero_heading_tr',
                'Hero başlığı TR (çeviri metninin üzerine yazar)',
                true,
                'Her satır yeni satır; kelimeler satır içinde boşlukla',
              ),
              fld(
                'hero_heading_en',
                'Hero başlığı EN (çeviri metninin üzerine yazar)',
                true,
              ),
              fld(
                'hero_subtitle_tr',
                'Hero alt metni TR (çeviri metninin üzerine yazar)',
                true,
              ),
              fld(
                'hero_subtitle_en',
                'Hero alt metni EN (çeviri metninin üzerine yazar)',
                true,
              ),
              fld('clients_section_title', '“Birlikte Çalıştıklarımız” başlığı'),
            ].map((f) => (
              <label
                key={f.key}
                className={`space-y-1 ${f.multiline ? 'md:col-span-2' : ''}`}
              >
                <span className="font-sans text-sm text-[#6B4C35]">{f.label}</span>
                {f.multiline ? (
                  <textarea
                    name={f.key}
                    defaultValue={initial[f.key] ?? ''}
                    rows={f.key.startsWith('hero_heading') ? 4 : 3}
                    placeholder={f.placeholder}
                    className="w-full resize-y rounded-lg border border-beige px-3 py-2 text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
                  />
                ) : (
                  <input
                    name={f.key}
                    defaultValue={initial[f.key] ?? ''}
                    className="h-11 w-full rounded-lg border border-beige px-3 text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
                  />
                )}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-serif text-xl text-[#3D1F10]">Bakım Modu</legend>
          <div className="h-px bg-[#EDE4D3]" aria-hidden />
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#EDE4D3] bg-[#F8F7F4] p-4">
            <input
              type="checkbox"
              checked={maintain}
              onChange={(e) => setMaintain(e.target.checked)}
              className="h-4 w-4 rounded border-[#EDE4D3] text-[#8B3A1E] focus:ring-[#8B3A1E]"
            />
            <span className="font-sans text-sm text-[#3D1F10]">
              Bakım modu açık — ziyaretçilere bakım sayfası gösterilir;{' '}
              <span className="font-medium">/admin</span> erişilebilir kalır.
            </span>
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              fld('maintenance_message_tr', 'Bakım mesajı TR', true),
              fld('maintenance_message_en', 'Bakım mesajı EN', true),
            ].map((f) => (
              <label key={f.key} className="space-y-1 md:col-span-2">
                <span className="font-sans text-sm text-[#6B4C35]">{f.label}</span>
                <textarea
                  name={f.key}
                  defaultValue={initial[f.key] ?? ''}
                  rows={3}
                  className="w-full resize-y rounded-lg border border-beige px-3 py-2 text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
                />
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-terracotta px-5 text-sm font-medium text-cream transition hover:bg-terracotta-dark"
        >
          Kaydet
        </button>
      </form>
    </>
  );
}
