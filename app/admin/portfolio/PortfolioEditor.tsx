'use client';

import { FormField } from '@/components/admin/FormField';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { portfolioCategoryOptions } from '@/lib/portfolio-category-labels';
import type { PortfolioItem } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

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

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#EDE4D3] bg-[#FAFAF8] px-4 py-3">
      <span className="font-sans text-sm text-[#3D1F10]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? 'bg-[#8B3A1E]' : 'bg-[#EDE4D3]'
        }`}
      >
        <span
          className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

type Props = {
  initial: PortfolioItem | null;
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction?: () => Promise<void>;
  submitLabel: string;
};

export function PortfolioEditor({
  initial,
  saveAction,
  deleteAction,
  submitLabel,
}: Props) {
  const router = useRouter();
  const [titleTr, setTitleTr] = useState(initial?.title_tr ?? '');
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugManual, setSlugManual] = useState(Boolean(initial?.slug));
  const autoSlug = useMemo(() => slugify(titleTr), [titleTr]);

  const [descTr, setDescTr] = useState(initial?.description_tr ?? '');
  const [descEn, setDescEn] = useState(initial?.description_en ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image ?? '');
  const [extraImages, setExtraImages] = useState<string[]>(
    Array.isArray(initial?.images) ? [...initial.images] : [],
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>(
    Array.isArray(initial?.tags) ? [...initial.tags] : [],
  );
  const [tagInput, setTagInput] = useState('');
  const [orderIndex, setOrderIndex] = useState(String(initial?.order_index ?? 0));
  const [featured, setFeatured] = useState(Boolean(initial?.is_featured));
  const [active, setActive] = useState(initial ? Boolean(initial.is_active) : true);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const categoryOptions = portfolioCategoryOptions();

  const addImage = () => {
    const u = newImageUrl.trim();
    if (!u) return;
    if (!extraImages.includes(u)) setExtraImages([...extraImages, u]);
    setNewImageUrl('');
  };

  const removeImage = (u: string) => {
    setExtraImages((prev) => prev.filter((x) => x !== u));
  };

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!category) {
      setFormError('Kategori seçimi zorunludur.');
      return;
    }
    const slugFinal = (slugManual ? slug : autoSlug).trim() || autoSlug;
    if (!slugFinal) {
      setFormError('Slug oluşturulamadı; başlık (TR) girin.');
      return;
    }

    const fd = new FormData();
    fd.set('title_tr', titleTr.trim());
    fd.set('title_en', titleEn.trim());
    fd.set('slug', slugFinal);
    fd.set('description_tr', descTr);
    fd.set('description_en', descEn);
    fd.set('category', category);
    fd.set('cover_image', coverUrl.trim());
    fd.set('images', extraImages.join(', '));
    fd.set('tags', tags.join(', '));
    fd.set('order_index', orderIndex);
    if (featured) fd.append('is_featured', 'on');
    if (active) fd.append('is_active', 'on');

    setSaving(true);
    try {
      await saveAction(fd);
    } catch {
      setFormError('Kayıt sırasında hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteAction) return;
    setDeleting(true);
    try {
      await deleteAction();
      router.push('/admin/portfolio');
      router.refresh();
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-xl border border-[#EDE4D3] bg-white p-6 md:p-8"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            type="text"
            label="Başlık TR"
            value={titleTr}
            onChange={(v) => {
              setTitleTr(v);
              if (!slugManual) setSlug(slugify(v));
            }}
            required
          />
          <FormField
            type="text"
            label="Başlık EN"
            value={titleEn}
            onChange={setTitleEn}
            required
          />
        </div>

        <div>
          <FormField
            type="text"
            label="Slug"
            value={slugManual ? slug : autoSlug}
            onChange={(v) => {
              setSlugManual(true);
              setSlug(v);
            }}
            placeholder={autoSlug}
            hint={
              <button
                type="button"
                className="text-[#8B3A1E] underline"
                onClick={() => {
                  setSlugManual(false);
                  setSlug(autoSlug);
                }}
              >
                TR başlıktan otomatik üret
              </button>
            }
            required
          />
        </div>

        <FormField
          type="select"
          label="Kategori"
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          placeholder="Seçin"
          required
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            type="textarea"
            label="Açıklama TR"
            value={descTr}
            onChange={setDescTr}
            rows={6}
          />
          <FormField
            type="textarea"
            label="Açıklama EN"
            value={descEn}
            onChange={setDescEn}
            rows={6}
          />
        </div>

        <ImageUpload label="Kapak görseli adresi" value={coverUrl} onChange={setCoverUrl} />

        <div>
          <span className="mb-1.5 block font-sans text-sm font-medium text-[#3D1F10]">
            Diğer görseller
          </span>
          <div className="flex flex-wrap gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://..."
              className="min-w-[200px] flex-1 rounded-lg border border-[#EDE4D3] px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addImage();
                }
              }}
            />
            <button
              type="button"
              onClick={addImage}
              className="rounded-lg border border-[#8B3A1E] px-4 py-2 text-sm font-medium text-[#8B3A1E] hover:bg-[#F5F0E6]"
            >
              Ekle
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {extraImages.map((url) => (
              <li
                key={url}
                className="flex items-center justify-between gap-2 rounded-lg border border-[#EDE4D3] bg-[#FAFAF8] px-3 py-2 text-xs"
              >
                <span className="truncate text-[#3D1F10]">{url}</span>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="shrink-0 text-red-600 hover:underline"
                  aria-label="Kaldır"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="mb-1.5 block font-sans text-sm font-medium text-[#3D1F10]">
            Etiketler
          </span>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Etiket yazıp Enter"
              className="min-w-[200px] flex-1 rounded-lg border border-[#EDE4D3] px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const t = tagInput.trim();
                  if (t && !tags.includes(t)) setTags([...tags, t]);
                  setTagInput('');
                }
              }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-[#EDE4D3] px-3 py-1 text-xs text-[#3D1F10]"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="font-bold text-[#8B3A1E]"
                  aria-label={`${t} kaldır`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <FormField
          type="text"
          label="Sıra"
          value={orderIndex}
          onChange={setOrderIndex}
          hint="Sayısal sıra (küçük önce gelir)."
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ToggleSwitch
            checked={featured}
            onChange={setFeatured}
            label="Öne çıkan"
          />
          <ToggleSwitch checked={active} onChange={setActive} label="Aktif" />
        </div>

        {formError ? (
          <p className="font-sans text-sm text-[#8B3A1E]">{formError}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-[#EDE4D3] pt-6">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#8B3A1E] px-6 font-sans text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#6B2C14] disabled:opacity-60"
          >
            {saving ? 'Kaydediliyor…' : submitLabel}
          </button>
          <Link
            href="/admin/portfolio"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#EDE4D3] px-6 font-sans text-sm font-medium text-[#3D1F10] transition hover:bg-[#F8F7F4]"
          >
            İptal
          </Link>
          {deleteAction ? (
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="ml-auto inline-flex min-h-[44px] items-center justify-center rounded-lg border border-red-200 px-6 font-sans text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              Sil
            </button>
          ) : null}
        </div>
      </form>

      {showDelete && deleteAction ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="font-sans text-lg font-semibold text-[#3D1F10]">
              Portfolyoyu sil
            </h2>
            <p className="mt-2 font-sans text-sm text-[#6B4C35]">
              Bu kayıt kalıcı olarak silinecek. Emin misiniz?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                disabled={deleting}
                className="rounded-lg border border-[#EDE4D3] px-4 py-2 text-sm"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {deleting ? 'Siliniyor…' : 'Evet, sil'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
