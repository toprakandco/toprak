'use client';

import { FormField } from '@/components/admin/FormField';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { BlogPost } from '@/types';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  action: (formData: FormData) => void;
  initial?: BlogPost | null;
  submitLabel: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

const prosePreviewClass =
  'blog-article-prose prose prose-lg max-w-none text-[#3D1F10] min-h-[200px] rounded-lg border border-[#EDE4D3] bg-[#FAFAF8] p-6';

export function BlogEditor({ action, initial, submitLabel }: Props) {
  const [titleTr, setTitleTr] = useState(initial?.title_tr ?? '');
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
  const [excerptTr, setExcerptTr] = useState(initial?.excerpt_tr ?? '');
  const [excerptEn, setExcerptEn] = useState(initial?.excerpt_en ?? '');
  const [contentTr, setContentTr] = useState(initial?.content_tr ?? '');
  const [contentEn, setContentEn] = useState(initial?.content_en ?? '');
  const [coverImage, setCoverImage] = useState(initial?.cover_image ?? '');
  const [tagInput, setTagInput] = useState((initial?.tags ?? []).join(', '));
  const [isPublished, setIsPublished] = useState(Boolean(initial?.is_published));
  const [publishedAt, setPublishedAt] = useState(
    toDatetimeLocalValue(initial?.published_at ?? null),
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLang, setPreviewLang] = useState<'tr' | 'en'>('tr');

  const previewTitle = previewLang === 'tr' ? titleTr : titleEn;
  const previewBody = previewLang === 'tr' ? contentTr : contentEn;

  const tagHiddenValue = useMemo(() => parseTags(tagInput).join(', '), [tagInput]);

  return (
    <form
      action={action}
      className={`space-y-5 rounded-xl border border-beige bg-white p-6 shadow-sm ${previewOpen ? 'lg:grid lg:grid-cols-2 lg:items-start lg:gap-8' : ''}`}
    >
      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-sans text-sm text-[#6B4C35]">
            Markdown desteklenir; önizleme yaklaşık görünümdür.
          </p>
          <button
            type="button"
            onClick={() => setPreviewOpen((v) => !v)}
            className="rounded-lg border border-[#EDE4D3] bg-[#F8F7F4] px-3 py-1.5 font-sans text-xs font-medium text-[#3D1F10] transition hover:bg-[#F0EBE0]"
          >
            {previewOpen ? 'Önizlemeyi gizle' : 'Canlı önizleme'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            type="text"
            label="Başlık TR"
            name="title_tr"
            required
            value={titleTr}
            onChange={(v) => {
              setTitleTr(v);
              if (!slugEdited) setSlug(slugify(v));
            }}
          />
          <FormField
            type="text"
            label="Başlık EN"
            name="title_en"
            required
            value={titleEn}
            onChange={setTitleEn}
          />
        </div>

        <FormField
          type="text"
          label="Slug"
          name="slug"
          required
          value={slug}
          onChange={(v) => {
            setSlugEdited(true);
            setSlug(v);
          }}
          hint="Başlık TR’den otomatik üretilir; düzenleyebilirsiniz."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-[#3D1F10]">
              İçerik TR
              <span className="ml-2 font-normal text-[#6B4C35]">
                (Markdown biçimi)
              </span>
            </label>
            <textarea
              name="content_tr"
              value={contentTr}
              onChange={(e) => setContentTr(e.target.value)}
              rows={10}
              className="w-full resize-y rounded-lg border border-[#EDE4D3] bg-white px-3 py-2.5 text-sm text-[#3D1F10] outline-none transition focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-[#3D1F10]">
              İçerik EN
              <span className="ml-2 font-normal text-[#6B4C35]">
                (Markdown biçimi)
              </span>
            </label>
            <textarea
              name="content_en"
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={10}
              className="w-full resize-y rounded-lg border border-[#EDE4D3] bg-white px-3 py-2.5 text-sm text-[#3D1F10] outline-none transition focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-[#3D1F10]">
              Özet TR{' '}
              <span className="font-normal text-[#6B4C35]">
                ({excerptTr.length}/200)
              </span>
            </label>
            <textarea
              name="excerpt_tr"
              value={excerptTr}
              maxLength={200}
              onChange={(e) => setExcerptTr(e.target.value.slice(0, 200))}
              rows={3}
              className="w-full resize-y rounded-lg border border-[#EDE4D3] bg-white px-3 py-2.5 text-sm text-[#3D1F10] outline-none transition focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-[#3D1F10]">
              Özet EN{' '}
              <span className="font-normal text-[#6B4C35]">
                ({excerptEn.length}/200)
              </span>
            </label>
            <textarea
              name="excerpt_en"
              value={excerptEn}
              maxLength={200}
              onChange={(e) => setExcerptEn(e.target.value.slice(0, 200))}
              rows={3}
              className="w-full resize-y rounded-lg border border-[#EDE4D3] bg-white px-3 py-2.5 text-sm text-[#3D1F10] outline-none transition focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
            />
          </div>
        </div>

        <ImageUpload
          label="Kapak görseli adresi"
          name="cover_image"
          value={coverImage}
          onChange={setCoverImage}
        />

        <div>
          <FormField
            type="text"
            label="Etiketler"
            value={tagInput}
            onChange={setTagInput}
            hint="Virgülle ayırın (ör. ajans, içerik, seslendirme)."
          />
          <input type="hidden" name="tags" value={tagHiddenValue} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <input type="hidden" name="is_published" value={isPublished ? 'on' : ''} />
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-[#EDE4D3] text-[#8B3A1E] focus:ring-[#8B3A1E]"
              />
              <span className="font-sans text-sm text-[#3D1F10]">Yayınlandı</span>
            </label>
          </div>
          <div>
            <label
              htmlFor="published_at"
              className="mb-1.5 block font-sans text-sm font-medium text-[#3D1F10]"
            >
              Yayın Tarihi
            </label>
            <input
              id="published_at"
              type="datetime-local"
              name="published_at"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#EDE4D3] bg-white px-3 text-sm text-[#3D1F10] outline-none transition focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-terracotta px-5 text-sm font-medium text-cream transition hover:bg-terracotta-dark"
        >
          {submitLabel}
        </button>
      </div>

      {previewOpen ? (
        <div className="min-w-0 space-y-3 lg:sticky lg:top-24">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPreviewLang('tr')}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                previewLang === 'tr'
                  ? 'bg-[#8B3A1E] text-cream'
                  : 'border border-[#EDE4D3] bg-white text-[#3D1F10]'
              }`}
            >
              TR önizleme
            </button>
            <button
              type="button"
              onClick={() => setPreviewLang('en')}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                previewLang === 'en'
                  ? 'bg-[#8B3A1E] text-cream'
                  : 'border border-[#EDE4D3] bg-white text-[#3D1F10]'
              }`}
            >
              EN önizleme
            </button>
          </div>
          {coverImage.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage.trim()}
              alt=""
              className="max-h-48 w-full rounded-lg border border-[#EDE4D3] object-cover"
            />
          ) : null}
          <h2 className="font-serif text-2xl text-[#3D1F10]">
            {previewTitle || 'Başlık'}
          </h2>
          <div className={prosePreviewClass}>
            {previewBody.trim() ? (
              <ReactMarkdown>{previewBody}</ReactMarkdown>
            ) : (
              <p className="text-[#6B4C35]">İçerik yazın…</p>
            )}
          </div>
        </div>
      ) : null}
    </form>
  );
}
