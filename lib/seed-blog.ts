import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Run once: import and call seedBlog() from a temp page or script.
 * Requires `is_featured` on `blog_posts` (see supabase migrations).
 */

export const SEED_BLOG_SLUGS = [
  'kreatif-ajansin-onemi',
  'ceviri-sanati',
  'seslendirme-tuyolari',
  'sosyal-medya-stratejisi',
] as const;

const ROWS = [
  {
    slug: 'kreatif-ajansin-onemi',
    title_tr: 'Küçük İşletmeler İçin Kreatif Ajansın Önemi',
    title_en: 'Why Small Businesses Need a Creative Agency',
    excerpt_tr:
      'Marka kimliğiniz sadece bir logo değil; müşterinin sizi hatırlama ve güvenme biçimidir.',
    excerpt_en:
      'Your brand identity is more than a logo — it is how customers remember and trust you.',
    content_tr: `<p>Küçük işletmeler için “kreatif ajans” lüks gibi görünse de, aslında net bir yatırımdır. Tutarlı bir görsel dil, doğru ton ve düzenli iletişim; sınırlı bütçeyle bile güven oluşturmanın en hızlı yoludur.</p>
<p>İyi bir ajans, sadece tasarım üretmez: hedef kitlenizi dinler, mesajınızı sadeleştirir ve her temasta aynı hikâyeyi anlatır. Bu birliktelik, reklam harcamalarınızın verimini doğrudan artırır.</p>
<p>Toprak & Co. olarak küçük ekiplerle çalışırken önce iş modelinizi ve sesinizi netleştiriyor, ardından sosyal medyadan web arayüzüne kadar tek çizgide ilerliyoruz. Böylece hem zaman hem bütçe tasarrufu sağlanır.</p>
<blockquote>Marka, ürününüzün etrafında büyüyen bir hikâyedir; o hikâyeyi birlikte yazmak, rekabetçi pazarlarda ayakta kalmanın anahtarıdır.</blockquote>
<p>Özetle: kreatif ajans, görünürlükten önce netlik ve güven üretir. Doğru ortaklıkla bu yolculuk hem ölçülebilir hem de sürdürülebilir olur.</p>`,
    content_en: `<p>For small businesses, hiring a creative agency can feel like a luxury — but it is a strategic investment. A coherent visual language, the right tone, and consistent storytelling build trust even on a modest budget.</p>
<p>A strong agency does not only deliver design: it listens to your audience, sharpens your message, and repeats one clear story across every touchpoint. That alignment improves the return on every marketing euro you spend.</p>
<p>At Toprak & Co., we start by clarifying your model and voice, then carry one line from social posts to your website. That saves both time and money.</p>
<blockquote>A brand is the story that grows around your product; writing that story together is how you stay visible in crowded markets.</blockquote>
<p>In short: a creative partner delivers clarity and trust before visibility. With the right collaboration, the journey stays measurable and sustainable.</p>`,
    tags: ['Marka', 'Tasarım', 'KOBİ'],
    cover_image: null,
    is_published: true,
    is_featured: true,
    published_at: '2025-01-15T09:00:00.000Z',
  },
  {
    slug: 'ceviri-sanati',
    title_tr: 'Çeviri Bir Sanat mıdır?',
    title_en: 'Is Translation an Art?',
    excerpt_tr:
      'Kelimeleri aktarmak yetmez, ruhu da taşımak gerekir; çeviri hem disiplin hem sezgidir.',
    excerpt_en:
      'Moving words is not enough — you must carry the spirit; translation is both craft and intuition.',
    content_tr: `<p>Çeviri, sözlükten cümleye aktarmaktan ibaret değildir. Bir metnin ritmini, mizahını ve kültürel gönderimlerini hedef dilde yeniden kurmak uzun pratik ister.</p>
<p>Akademik metinlerde terminoloji titizliği ön plandayken, edebiyatta ses tonu ve imgeler öne çıkar. İyi çevirmen, yazarın “görünmez ortağı” gibi çalışır.</p>
<p>Editoryal süreçte geri bildirim döngüsü şarttır: ilk taslak nadir olarak son sürümdür. Okur testleri ve yazar onayı, çevirinin doğal akmasını sağlar.</p>
<blockquote>Çeviri, iki dil arasında ince bir köprüdür; köprünün güvenliği hem bilgiye hem sezgiye dayanır.</blockquote>
<p>Sonuç olarak çeviriyi hem zanaat hem sanat olarak görmek mümkün: kurallara saygı, yaratıcı kararlar ve sürekli okuma pratiği bir araya geldiğinde metin hayat bulur.</p>`,
    content_en: `<p>Translation is not moving words from dictionary to sentence. It rebuilds rhythm, humour, and cultural cues in a new language — a skill honed over years.</p>
<p>In academic work, terminology matters most; in literature, voice and imagery lead. A good translator works like an invisible co-author.</p>
<p>Editorial feedback loops matter: the first draft is rarely the last. Reader tests and author sign-off keep the text natural.</p>
<blockquote>Translation is a narrow bridge between two languages; its strength rests on both knowledge and intuition.</blockquote>
<p>So yes — translation can be seen as craft and art: respect for rules, creative choices, and relentless reading practice bring the text to life.</p>`,
    tags: ['Çeviri', 'Dil', 'Kültür'],
    cover_image: null,
    is_published: true,
    is_featured: false,
    published_at: '2025-02-01T11:30:00.000Z',
  },
  {
    slug: 'seslendirme-tuyolari',
    title_tr: 'Profesyonel Seslendirme İçin 5 İpucu',
    title_en: '5 Tips for Professional Voice Over',
    excerpt_tr:
      'Ses, dinleyiciyle kurulan en doğrudan köprüdür; küçük detaylar büyük fark yaratır.',
    excerpt_en:
      'Voice is the most direct bridge to the listener; small details make a big difference.',
    content_tr: `<p>İyi bir seslendirme; doğru nefes, net artikülasyon ve senaryoya uygun tempo ile başlar. Kayıt öncesi ısınma, özellikle uzun metinlerde yorgunluğu geciktirir.</p>
<p>Mikrofon mesafesi ve oda akustiği tonunuzu değiştirir. Her ortamda kısa bir test kaydı almak, son mix’te sürprizleri azaltır.</p>
<p>Yönetmen geri bildirimi kritik: “daha sıcak” veya “daha resmi” gibi yönlendirmeleri somut cümlelerle eşleştirmek verimi artırır.</p>
<p>Post-prodüksiyonda hafif EQ ve kompresyon ile sesi oturtmak mümkün; ancak kaynak performans güçlü değilse düzeltme sınırlı kalır.</p>
<blockquote>Sesiniz markanızın duyulan yüzüdür; küçük provalar büyük prodüksiyonları kurtarır.</blockquote>`,
    content_en: `<p>Strong voice over starts with breath support, clear articulation, and pacing that fits the script. Warming up before long sessions delays fatigue.</p>
<p>Mic distance and room acoustics change your tone. A quick test recording in each space prevents surprises at mix time.</p>
<p>Director feedback is essential: translate notes like “warmer” or “more formal” into concrete line reads.</p>
<p>Light EQ and compression in post can polish a take — but they cannot fix a weak performance.</p>
<blockquote>Your voice is the audible face of the brand; small rehearsals save big productions.</blockquote>`,
    tags: ['Seslendirme', 'Ses', 'Prodüksiyon'],
    cover_image: null,
    is_published: true,
    is_featured: false,
    published_at: '2025-02-18T08:15:00.000Z',
  },
  {
    slug: 'sosyal-medya-stratejisi',
    title_tr: "2025'te Sosyal Medya Stratejisi Nasıl Kurulur?",
    title_en: 'How to Build a Social Media Strategy in 2025',
    excerpt_tr:
      'Algoritma değişiyor, ama hikaye anlatımı değişmiyor; odak, tutarlılık ve ölçüm.',
    excerpt_en:
      'Algorithms change, but storytelling does not — focus on consistency and measurement.',
    content_tr: `<p>2025’te platformlar daha da parçalı; tek bir “doğru format” yok. Bunun yerine hedef kitlenizin hangi kanalda zaman geçirdiğini ve hangi içerik türüne tepki verdiğini veriyle görmek şart.</p>
<p>İçerik takvimi, sadece yayın günlerini değil; üretim, onay ve yayın sürelerini de kapsamalı. Küçük ekiplerde şablonlar ve tekrar kullanılabilir görseller iş yükünü düşürür.</p>
<p>Topluluk yönetimi: yorumlara hızlı ve tutarlı bir sesle yanıt vermek, algoritmadan bağımsız olarak güven oluşturur.</p>
<p>Ölçüm tarafında temel KPI’lar — erişim, etkileşim, kayıt veya satış dönüşümü — hedefinize göre seçilmeli. Aylık geriye dönük analiz, bir sonraki çeyreğin içerik karışımını şekillendirir.</p>
<blockquote>Strateji, her gün daha fazla içerik üretmek değil; doğru mesajı doğru sıklıkta tekrar etmektir.</blockquote>`,
    content_en: `<p>In 2025, platforms are more fragmented; there is no single “winning format.” Instead, use data to see where your audience spends time and what they engage with.</p>
<p>Your calendar should cover production, approval, and publishing — not just posting days. Templates and reusable visuals reduce load for small teams.</p>
<p>Community management matters: fast, consistent replies to comments build trust regardless of algorithms.</p>
<p>Pick KPIs — reach, engagement, sign-ups, or sales — that match your goal. A monthly review shapes next quarter’s content mix.</p>
<blockquote>Strategy is not posting more every day; it is repeating the right message at the right cadence.</blockquote>`,
    tags: ['Sosyal Medya', 'Strateji', 'İçerik'],
    cover_image: null,
    is_published: true,
    is_featured: false,
    published_at: '2025-03-10T14:00:00.000Z',
  },
] as const;

export async function seedBlog(): Promise<{ inserted: number; error?: string }> {
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
    const { error } = await client.from('blog_posts').upsert(
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
