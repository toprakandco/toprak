'use client';

import type { ProjectApplication } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState, useTransition } from 'react';
import {
  deleteProjectApplication,
  markProjectApplicationRead,
  markProjectApplicationUnread,
} from './actions';

type Filter = 'all' | 'unread' | 'read';

type Props = {
  rows: ProjectApplication[];
  filter: Filter;
  unreadCount: number;
};

const SERVICE_TR: Record<string, string> = {
  'grafik-tasarim': 'Grafik Tasarım',
  ceviri: 'Çeviri',
  seslendirme: 'Seslendirme',
  'icerik-uretimi': 'İçerik & Sosyal',
  'fotograf-video': 'Fotoğraf & Video',
  'web-yazilim': 'Web & Yazılım',
};

const BUDGET_TR: Record<string, string> = {
  'lt-5k': '< 5.000 ₺',
  '5-15k': '5-15K ₺',
  '15-30k': '15-30K ₺',
  '30k-plus': '30K+ ₺',
  'prefer-not': 'Belirtmek istemiyorum',
};

const TIMELINE_TR: Record<string, string> = {
  'urgent-1-3': 'Acil (1-3 gün)',
  '1-2-weeks': '1-2 Hafta',
  '1-month': '1 Ay',
  flexible: 'Esnek',
};

const PREF_TR: Record<string, string> = {
  email: 'E-posta',
  whatsapp: 'WhatsApp',
  video: 'Video Görüşme',
  any: 'Fark etmez',
};

function fmtServices(services: string[]) {
  return services.map((s) => SERVICE_TR[s] ?? s).join(', ');
}

function statusLabel(read: boolean) {
  return read ? 'Okundu' : 'Yeni';
}

export function ApplicationsListClient({
  rows: initialRows,
  filter,
  unreadCount,
}: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const patchRow = (id: string, patch: Partial<ProjectApplication>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const refresh = () => router.refresh();

  const onMarkRead = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    patchRow(id, { is_read: true });
    startTransition(async () => {
      try {
        await markProjectApplicationRead(id);
        refresh();
      } catch {
        patchRow(id, { is_read: row.is_read });
      }
    });
  };

  const onMarkUnread = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    patchRow(id, { is_read: false });
    startTransition(async () => {
      try {
        await markProjectApplicationUnread(id);
        refresh();
      } catch {
        patchRow(id, { is_read: row.is_read });
      }
    });
  };

  const onDelete = (id: string) => {
    if (!window.confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return;
    startTransition(async () => {
      await deleteProjectApplication(id);
      setOpenId(null);
      refresh();
    });
  };

  const tabClass = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
      active
        ? 'border-[#8B3A1E] bg-[#8B3A1E] text-cream'
        : 'border-[#EDE4D3] bg-white text-[#3D1F10] hover:bg-[#F8F7F4]'
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/applications" className={tabClass(filter === 'all')}>
          Tümü
        </Link>
        <Link
          href="/admin/applications?filter=unread"
          className={tabClass(filter === 'unread')}
        >
          Yeni
          {unreadCount > 0 ? (
            <span className="rounded-full bg-cream/25 px-2 py-0.5 text-xs tabular-nums">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </Link>
        <Link href="/admin/applications?filter=read" className={tabClass(filter === 'read')}>
          Okundu
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#EDE4D3] bg-white shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-[#EDE4D3] bg-[#FDFCF9] text-[11px] font-semibold uppercase tracking-wide text-[#6B4C35]">
              <th className="px-4 py-3">İsim</th>
              <th className="px-4 py-3">Hizmetler</th>
              <th className="px-4 py-3">Bütçe</th>
              <th className="px-4 py-3">Süre</th>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#6B4C35]">
                  Kayıt yok.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const expanded = openId === row.id;
                return (
                  <Fragment key={row.id}>
                    <tr
                      className="cursor-pointer border-b border-[#EDE4D3] transition hover:bg-[#F8F7F4]/80"
                      onClick={() => setOpenId(expanded ? null : row.id)}
                    >
                      <td className="max-w-[140px] truncate px-4 py-3 font-medium text-[#3D1F10]">
                        {row.name}
                      </td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-[#3D1F10]/85">
                        {fmtServices(row.services)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#3D1F10]/85">
                        {BUDGET_TR[row.budget] ?? row.budget}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#3D1F10]/85">
                        {TIMELINE_TR[row.timeline] ?? row.timeline}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[#3D1F10]/70">
                        {new Date(row.created_at).toLocaleString('tr-TR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.is_read
                              ? 'bg-[#E8E4DC] text-[#3D1F10]/80'
                              : 'bg-[#8B3A1E]/15 text-[#8B3A1E]'
                          }`}
                        >
                          {statusLabel(row.is_read)}
                        </span>
                      </td>
                    </tr>
                    {expanded ? (
                      <tr key={`${row.id}-detail`} className="border-b border-[#EDE4D3] bg-[#FAFAF8]">
                        <td colSpan={6} className="px-4 py-4">
                          <div className="grid gap-4 text-sm md:grid-cols-2">
                            <dl className="space-y-2">
                              <div>
                                <dt className="text-[11px] font-semibold uppercase text-[#6B4C35]">
                                  E-posta
                                </dt>
                                <dd>
                                  <a
                                    href={`mailto:${row.email}`}
                                    className="text-[#8B3A1E] underline"
                                  >
                                    {row.email}
                                  </a>
                                </dd>
                              </div>
                              {row.phone ? (
                                <div>
                                  <dt className="text-[11px] font-semibold uppercase text-[#6B4C35]">
                                    Telefon
                                  </dt>
                                  <dd>{row.phone}</dd>
                                </div>
                              ) : null}
                              {row.company ? (
                                <div>
                                  <dt className="text-[11px] font-semibold uppercase text-[#6B4C35]">
                                    Şirket / Marka
                                  </dt>
                                  <dd>{row.company}</dd>
                                </div>
                              ) : null}
                              <div>
                                <dt className="text-[11px] font-semibold uppercase text-[#6B4C35]">
                                  İletişim tercihi
                                </dt>
                                <dd>{PREF_TR[row.contact_preference] ?? row.contact_preference}</dd>
                              </div>
                              {row.reference_url ? (
                                <div>
                                  <dt className="text-[11px] font-semibold uppercase text-[#6B4C35]">
                                    Referans
                                  </dt>
                                  <dd>
                                    <a
                                      href={row.reference_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="break-all text-[#8B3A1E] underline"
                                    >
                                      {row.reference_url}
                                    </a>
                                  </dd>
                                </div>
                              ) : null}
                            </dl>
                            <div>
                              <dt className="text-[11px] font-semibold uppercase text-[#6B4C35]">
                                Proje detayı
                              </dt>
                              <dd className="mt-1 whitespace-pre-wrap rounded-lg border border-[#EDE4D3] bg-white p-3 text-[#3D1F10]">
                                {row.description}
                              </dd>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {row.is_read ? (
                              <button
                                type="button"
                                disabled={pending}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkUnread(row.id);
                                }}
                                className="rounded-lg border border-[#EDE4D3] bg-white px-3 py-1.5 text-xs font-medium text-[#3D1F10] hover:bg-[#F8F7F4]"
                              >
                                Okunmadı işaretle
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={pending}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkRead(row.id);
                                }}
                                className="rounded-lg border border-[#8B3A1E] bg-[#8B3A1E]/10 px-3 py-1.5 text-xs font-medium text-[#8B3A1E] hover:bg-[#8B3A1E]/20"
                              >
                                Okundu işaretle
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={pending}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row.id);
                              }}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100"
                            >
                              Sil
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
