'use client';

import { SERVICE_SLUGS } from '@/lib/service-slugs';
import type { PortfolioItem } from '@/types';
import { useMemo, useState } from 'react';

type Props = {
  action: (formData: FormData) => void;
  initial?: PortfolioItem | null;
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

export function PortfolioForm({ action, initial, submitLabel }: Props) {
  const [titleTr, setTitleTr] = useState(initial?.title_tr ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));

  const generatedSlug = useMemo(() => slugify(titleTr), [titleTr]);

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
              const next = e.target.value;
              setTitleTr(next);
              if (!slugEdited) setSlug(slugify(next));
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
          placeholder={generatedSlug}
          className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Açıklama (TR)</span>
          <textarea
            name="description_tr"
            rows={6}
            defaultValue={initial?.description_tr ?? ''}
            className="w-full rounded-lg border border-beige px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Açıklama (EN)</span>
          <textarea
            name="description_en"
            rows={6}
            defaultValue={initial?.description_en ?? ''}
            className="w-full rounded-lg border border-beige px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Kategori</span>
          <select
            name="category"
            defaultValue={initial?.category ?? ''}
            className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
          >
            <option value="">-</option>
            {SERVICE_SLUGS.map((slugOption) => (
              <option key={slugOption} value={slugOption}>
                {slugOption}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm">Kapak Görseli URL</span>
          <input
            name="cover_image"
            defaultValue={initial?.cover_image ?? ''}
            className="h-11 w-full rounded-lg border border-beige px-3 text-sm"
          />
        </label>
      </div>

      <label className="space-y-1">
        <span className="text-sm">Diğer Görseller (virgülle)</span>
        <input
          name="images"
          defaultValue={(initial?.images ?? []).join(', ')}
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_featured" defaultChecked={Boolean(initial?.is_featured)} />
          Öne Çıkan
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={initial ? Boolean(initial.is_active) : true} />
          Aktif
        </label>
        <label className="space-y-1">
          <span className="text-sm">Sıra</span>
          <input
            type="number"
            name="order_index"
            defaultValue={initial?.order_index ?? 0}
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
