import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Run once: import and call seedPortfolio() from a temp page or script.
 * Prefer SUPABASE_SERVICE_ROLE_KEY if RLS blocks anon writes.
 */

export const SEED_PORTFOLIO_SLUGS = [
  'doga-magazin-kapak',
  'edebiyat-ceviri-proje',
  'kurumsal-seslendirme-spot',
  'kitabevi-sosyal-kampanya',
  'organik-urun-fotografi',
  'kreatif-ajans-web',
] as const;

const ROWS = [
  {
    slug: 'doga-magazin-kapak',
    title_tr: 'Doğa Dergisi Kapak Serisi',
    title_en: 'Nature Magazine Cover Series',
    description_tr:
      'Üç sayılık kapak tasarımı; organik formlar, toprak tonları ve okuyucuyu içeri davet eden tipografi. Yayın ekibiyle birlikte geliştirilen görsel dil, derginin sakin ve keşif odaklı sesiyle uyumlu.',
    description_en:
      'A three-issue cover series with organic shapes, earth tones and inviting typography. The visual language, developed with the editorial team, matches the magazine’s calm, discovery-led voice.',
    category: 'grafik-tasarim',
    cover_image: null,
    images: [] as string[],
    tags: ['Kapak', 'Dergi', 'Kurumsal'],
    is_featured: true,
    is_active: true,
    order_index: 1,
  },
  {
    slug: 'edebiyat-ceviri-proje',
    title_tr: 'Çağdaş Roman Çevirisi',
    title_en: 'Contemporary Novel Translation',
    description_tr:
      'İngilizce bir romanı Türkçeye aktarma sürecinde editoryal titizlik, kültürel nüanslar ve yazarın sesini koruma önceliği. Dipnotlar, karakter diyalogları ve bölüm başlıkları için tutarlı bir stil rehberi uygulandı.',
    description_en:
      'Bringing an English novel into Turkish with editorial care, cultural nuance and fidelity to the author’s voice. A consistent style guide covered footnotes, dialogue and chapter titles.',
    category: 'ceviri',
    cover_image: null,
    images: [] as string[],
    tags: ['Kitap', 'TR↔EN', 'Edebiyat'],
    is_featured: true,
    is_active: true,
    order_index: 2,
  },
  {
    slug: 'kurumsal-seslendirme-spot',
    title_tr: 'Kurumsal Tanıtım Spotu',
    title_en: 'Corporate Brand Spot',
    description_tr:
      'Kısa süreli kampanya için sıcak ve güven veren bir ses tonu; stüdyo kaydı, yönetmenlik ve son mix. Markanın değer önerisi net biçimde öne çıkarıldı.',
    description_en:
      'A warm, trustworthy tone for a short campaign spot — studio recording, direction and final mix. The brand’s value proposition comes through clearly.',
    category: 'seslendirme',
    cover_image: null,
    images: [] as string[],
    tags: ['Reklam', 'Kurumsal', 'Stüdyo'],
    is_featured: false,
    is_active: true,
    order_index: 3,
  },
  {
    slug: 'kitabevi-sosyal-kampanya',
    title_tr: 'Kitabevi Sosyal Medya Kampanyası',
    title_en: 'Bookstore Social Campaign',
    description_tr:
      'Aylık içerik takvimi, görsel şablonlar ve Reels senaryoları. Okuma alışkanlığını teşvik eden ton; yerel yazar buluşmaları ve yeni çıkan kitaplar için özel seriler.',
    description_en:
      'Monthly content calendar, visual templates and Reels scripts. A tone that encourages reading, plus series for local author events and new releases.',
    category: 'icerik-uretimi',
    cover_image: null,
    images: [] as string[],
    tags: ['Instagram', 'Reels', 'İçerik'],
    is_featured: false,
    is_active: true,
    order_index: 4,
  },
  {
    slug: 'organik-urun-fotografi',
    title_tr: 'Organik Ürün Fotoğraf Seti',
    title_en: 'Organic Product Photo Set',
    description_tr:
      'E-ticaret ve katalog için doğal ışık ve minimal set tasarımı. Renk düzeltme ve kırpma ile markanın doğa dostu kimliği vurgulandı.',
    description_en:
      'Natural light and a minimal set for e-commerce and catalogue. Colour grading and crops highlight the brand’s eco-friendly identity.',
    category: 'fotograf-video',
    cover_image: null,
    images: [] as string[],
    tags: ['Ürün', 'E-ticaret', 'Renk'],
    is_featured: false,
    is_active: true,
    order_index: 5,
  },
  {
    slug: 'kreatif-ajans-web',
    title_tr: 'Kreatif Ajans Web Sitesi',
    title_en: 'Creative Agency Website',
    description_tr:
      'Next.js ve çok dilli yapı ile hızlı, erişilebilir ve kolay güncellenen bir vitrin. İletişim formları, portföy modülleri ve blog entegrasyonu tek kod tabanında.',
    description_en:
      'A fast, accessible, easy-to-update showcase with Next.js and i18n. Contact flows, portfolio modules and blog in one codebase.',
    category: 'web-yazilim',
    cover_image: null,
    images: [] as string[],
    tags: ['Next.js', 'Web', 'Çok dilli'],
    is_featured: false,
    is_active: true,
    order_index: 6,
  },
] as const;

export async function seedPortfolio(): Promise<{ inserted: number; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      inserted: 0,
      error: 'Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key',
    };
  }

  const client = createClient(url, key) as SupabaseClient;
  let inserted = 0;

  for (const row of ROWS) {
    const { error } = await client.from('portfolio_items').upsert(
      { ...row },
      { onConflict: 'slug' },
    );
    if (error) {
      return { inserted, error: error.message };
    }
    inserted += 1;
  }

  return { inserted };
}
