'use client';

import type { BlogPost } from '@/types';
import { useState } from 'react';

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

export function BlogForm({ action, initial, submitLabel }: Props) {
  const [titleTr, setTitleTr] = useState(initial?.title_tr ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));

  return (
    <form action={action} className="space-y-5 rounded-xl border border-beige bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Başlık (TR)</span>
          <input
            name="title_tr"
            required
            value={titleTr}
            onChange={(e) => {
              const v = e.target.value;
              setTitleTr(v);
              if (!slugEdited) setSlug(slugify(v));
            }}
            className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Başlık (EN)</span>
          <input
            name="title_en"
            required
            defaultValue={initial?.title_en ?? ''}
            className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
          />
        </label>
      </div>

      <label className="space-y-1">
        <span className="text-sm">Slug</span>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugEdited(true);
            setSlug(e.target.value);
          }}
          className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Özet (TR)</span>
          <textarea
            name="excerpt_tr"
            rows={3}
            defaultValue={initial?.excerpt_tr ?? ''}
            className="w-full rounded-lg border border-beige px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Özet (EN)</span>
          <textarea
            name="excerpt_en"
            rows={3}
            defaultValue={initial?.excerpt_en ?? ''}
            className="w-full rounded-lg border border-beige px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">İçerik (TR, markdown)</span>
          <textarea
            name="content_tr"
            rows={10}
            defaultValue={initial?.content_tr ?? ''}
            className="w-full rounded-lg border border-beige px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm">İçerik (EN, markdown)</span>
          <textarea
            name="content_en"
            rows={10}
            defaultValue={initial?.content_en ?? ''}
            className="w-full rounded-lg border border-beige px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Kapak Görseli URL</span>
          <input
            name="cover_image"
            defaultValue={initial?.cover_image ?? ''}
            className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Etiketler (virgülle)</span>
          <input
            name="tags"
            defaultValue={(initial?.tags ?? []).join(', ')}
            className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_published" defaultChecked={Boolean(initial?.is_published)} />
          Yayınlandı
        </label>
        <label className="space-y-1">
          <span className="text-sm">Yayın Tarihi</span>
          <input
            type="date"
            name="published_at"
            defaultValue={initial?.published_at ? initial.published_at.slice(0, 10) : ''}
            className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-terracotta px-5 text-sm font-medium text-cream transition hover:bg-terracotta-dark"
      >
        {submitLabel}
      </button>
    </form>
  );
}
