'use client';

import { formatTurkishGsmDisplay } from '@/lib/phone-tr';
import type { CallbackRequest } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { setCallbackRequestCalled } from './callback-actions';

const TIME_LABELS: Record<string, string> = {
  morning: 'Sabah (09-12)',
  noon: 'Öğlen (12-15)',
  evening: 'Akşam (15-18)',
  any: 'Fark etmez',
};

type Props = {
  rows: CallbackRequest[];
};

export function CallbackRequestsListClient({ rows: initialRows }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const onToggle = (id: string, next: boolean) => {
    const prev = rows.find((r) => r.id === id)?.is_called;
    setRows((list) =>
      list.map((r) => (r.id === id ? { ...r, is_called: next } : r)),
    );
    startTransition(async () => {
      try {
        await setCallbackRequestCalled(id, next);
        router.refresh();
      } catch {
        setRows((list) =>
          list.map((r) =>
            r.id === id ? { ...r, is_called: prev ?? false } : r,
          ),
        );
      }
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[#EDE4D3] bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left font-sans text-sm text-[#3D1F10]">
        <thead>
          <tr className="border-b border-[#EDE4D3] bg-[#F8F7F4] text-[13px] font-medium text-[#6B4C35]">
            <th className="px-4 py-3">Telefon</th>
            <th className="px-4 py-3">Uygun zaman</th>
            <th className="px-4 py-3">Tarih</th>
            <th className="px-4 py-3">Arandı mı?</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-[#6B4C35]">
                Kayıt yok.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-[#EDE4D3]/80 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]/90'
                }`}
              >
                <td className="px-4 py-3 font-medium tabular-nums">
                  {formatTurkishGsmDisplay(row.phone)}
                </td>
                <td className="px-4 py-3 text-[#3D1F10]/85">
                  {TIME_LABELS[row.preferred_time] ?? row.preferred_time}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[#6B4C35]">
                  {new Date(row.created_at).toLocaleString('tr-TR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
                <td className="px-4 py-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 font-sans text-sm">
                    <input
                      type="checkbox"
                      checked={row.is_called}
                      disabled={pending}
                      onChange={(e) => onToggle(row.id, e.target.checked)}
                      className="h-4 w-4 rounded border-[#EDE4D3] text-[#5C7A52] focus:ring-[#5C7A52]"
                    />
                    <span className="text-[#6B4C35]">Arandı</span>
                  </label>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
