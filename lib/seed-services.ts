import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Run once: import and call seedServices() from a temp page or Node script.
 * Prefer SUPABASE_SERVICE_ROLE_KEY for inserts if RLS blocks anon writes.
 */
const ROWS = [
  {
    slug: 'grafik-tasarim',
    title_tr: 'Grafik Tasarım',
    title_en: 'Graphic Design',
    description_tr:
      'Sosyal medya gönderileri, pankartlar, kitap kapakları, dergi tasarımı ve kurumsal kimlik çalışmaları. Her platform için özel, dikkat çekici görsel içerikler üretiyoruz.',
    description_en:
      'Social posts, banners, book covers, magazine layouts and corporate identity work. We produce tailored, eye-catching visual content for every platform.',
    tags: [
      'Sosyal Medya',
      'Afiş',
      'Kitap Kapağı',
      'Kurumsal Kimlik',
      'Dergi',
    ],
    icon: 'grafik-tasarim',
    order_index: 1,
    is_active: true,
  },
  {
    slug: 'ceviri',
    title_tr: 'Çeviri',
    title_en: 'Translation',
    description_tr:
      'Türkçe, İngilizce, Fransızca ve Almanca arasında profesyonel çeviri. 3 yayımlanmış çeviri kitabı ve onlarca akademik makale deneyimiyle hassas, akıcı çeviriler sunuyoruz.',
    description_en:
      'Professional translation between Turkish, English, French and German. With three published book translations and dozens of academic articles, we deliver precise, fluent copy.',
    tags: ['TR↔EN', 'TR↔FR', 'TR↔DE', 'Kitap', 'Makale', 'Akademik'],
    icon: 'ceviri',
    order_index: 2,
    is_active: true,
  },
  {
    slug: 'seslendirme',
    title_tr: 'Seslendirme',
    title_en: 'Voice Over',
    description_tr:
      'Belgesel, reklam, e-learning, kitap ve kurumsal projeler için profesyonel seslendirme. Stüdyo kalitesinde kayıt ve yönetmenlik deneyimiyle kusursuz ses prodüksiyonu.',
    description_en:
      'Professional voice over for documentary, advertising, e-learning, audiobooks and corporate projects. Studio-grade recording and direction for polished audio production.',
    tags: ['Belgesel', 'Reklam', 'Kitap', 'E-learning', 'Kurumsal'],
    icon: 'seslendirme',
    order_index: 3,
    is_active: true,
  },
  {
    slug: 'icerik-uretimi',
    title_tr: 'İçerik Üretimi & Sosyal Medya',
    title_en: 'Content & Social Media',
    description_tr:
      'Markanızın sesini buluyoruz. Strateji, planlama, görsel üretim ve yayınlama — turizm, kitabevi ve kozmetik sektörlerinde kanıtlanmış sosyal medya yönetimi deneyimi.',
    description_en:
      'We find your brand voice. Strategy, planning, creative production and publishing — proven social media management across tourism, book retail and beauty.',
    tags: [
      'Instagram',
      'İçerik Stratejisi',
      'Sosyal Medya Yönetimi',
      'Reels',
    ],
    icon: 'icerik-uretimi',
    order_index: 4,
    is_active: true,
  },
  {
    slug: 'fotograf-video',
    title_tr: 'Fotoğraf & Video',
    title_en: 'Photo & Video',
    description_tr:
      'Ürün fotoğrafçılığından kurumsal video prodüksiyona, kısa filmden sosyal medya içeriklerine. Profesyonel çekim, kurgu ve renk düzeltme hizmetleri sunuyoruz.',
    description_en:
      'From product photography to corporate video, short film to social content. Professional shooting, editing and colour grading.',
    tags: [
      'Ürün Fotoğrafı',
      'Kurumsal Video',
      'Reels',
      'Kurgu',
      'Renk Düzeltme',
    ],
    icon: 'fotograf-video',
    order_index: 5,
    is_active: true,
  },
  {
    slug: 'web-yazilim',
    title_tr: 'Web & Yazılım',
    title_en: 'Web & Software',
    description_tr:
      'Next.js, Supabase ve modern teknolojilerle hızlı, şık ve ölçeklenebilir web siteleri. 5 canlı site referansıyla baştan sona geliştirme ve bakım hizmetleri.',
    description_en:
      'Fast, elegant, scalable sites with Next.js, Supabase and modern stacks. End-to-end build and maintenance with five live references.',
    tags: ['Next.js', 'Web Sitesi', 'E-ticaret', 'Bakım & Güncelleme'],
    icon: 'web-yazilim',
    order_index: 6,
    is_active: true,
  },
] as const;

export async function seedServices(): Promise<{ inserted: number; error?: string }> {
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
    const { error } = await client.from('services').upsert(row, {
      onConflict: 'slug',
    });
    if (error) {
      return { inserted, error: error.message };
    }
    inserted += 1;
  }

  return { inserted };
}
