'use client';

import { useCallback, useState } from 'react';

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  name?: string;
};

export function ImageUpload({
  label = 'Görsel URL',
  value,
  onChange,
  error,
  name,
}: Props) {
  const [previewOk, setPreviewOk] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkUrl = useCallback(async () => {
    const url = value.trim();
    if (!url) {
      setPreviewOk(false);
      return;
    }
    setChecking(true);
    setPreviewOk(false);
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = url;
      });
      setPreviewOk(true);
    } catch {
      setPreviewOk(false);
    } finally {
      setChecking(false);
    }
  }, [value]);

  return (
    <div>
      {label ? (
        <label className="mb-1.5 block font-sans text-sm font-medium text-[#3D1F10]">
          {label}
        </label>
      ) : null}
      <input
        type="url"
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setPreviewOk(false);
        }}
        onBlur={checkUrl}
        placeholder="https://..."
        className="h-11 w-full rounded-lg border border-[#EDE4D3] bg-white px-3 text-sm text-[#3D1F10] outline-none transition focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
      />
      {checking ? (
        <p className="mt-2 font-sans text-xs text-[#6B4C35]">Kontrol ediliyor…</p>
      ) : null}
      {value.trim() && previewOk ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-[#EDE4D3] bg-[#F8F7F4] p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.trim()}
            alt=""
            className="mx-auto max-h-48 w-auto max-w-full object-contain"
          />
        </div>
      ) : null}
      {value.trim() && !previewOk && !checking ? (
        <p className="mt-2 font-sans text-xs text-[#6B4C35]">
          Önizleme için alan dışına tıklayın (geçerli görsel URL&apos;i).
        </p>
      ) : null}
      {error ? (
        <p className="mt-1 font-sans text-xs text-[#8B3A1E]">{error}</p>
      ) : null}
    </div>
  );
}
