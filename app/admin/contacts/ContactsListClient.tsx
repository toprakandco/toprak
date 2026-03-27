'use client';

import type { Contact } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import {
  deleteContactRow,
  markContactRead,
  markContactUnread,
} from './actions';

type Filter = 'all' | 'unread' | 'read';

type Props = {
  contacts: Contact[];
  filter: Filter;
  unreadCount: number;
};

function statusLabel(read: boolean) {
  return read ? 'Okundu' : 'Okunmadı';
}

export function ContactsListClient({
  contacts: initialContacts,
  filter,
  unreadCount,
}: Props) {
  const router = useRouter();
  const [contacts, setContacts] = useState(initialContacts);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  useEffect(() => {
    if (selected && !initialContacts.some((c) => c.id === selected.id)) {
      setSelected(null);
    }
  }, [initialContacts, selected]);

  const patchRow = (id: string, patch: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setSelected((s) => (s?.id === id ? { ...s, ...patch } : s));
  };

  const refresh = () => router.refresh();

  const onMarkRead = (id: string) => {
    const row = contacts.find((c) => c.id === id);
    if (!row) return;
    patchRow(id, { is_read: true });
    startTransition(async () => {
      try {
        await markContactRead(id);
        refresh();
      } catch {
        patchRow(id, { is_read: row.is_read });
      }
    });
  };

  const onMarkUnread = (id: string) => {
    const row = contacts.find((c) => c.id === id);
    if (!row) return;
    patchRow(id, { is_read: false });
    startTransition(async () => {
      try {
        await markContactUnread(id);
        refresh();
      } catch {
        patchRow(id, { is_read: row.is_read });
      }
    });
  };

  const onDelete = (id: string) => {
    if (!window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    startTransition(async () => {
      await deleteContactRow(id);
      setSelected(null);
      refresh();
    });
  };

  const mailtoHref = (row: Contact) => {
    const subj = row.subject?.trim()
      ? `Re: ${row.subject.trim()}`
      : 'İletişim formu yanıtı';
    return `mailto:${row.email}?subject=${encodeURIComponent(subj)}`;
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
        <Link href="/admin/contacts" className={tabClass(filter === 'all')}>
          Tümü
        </Link>
        <Link href="/admin/contacts?filter=unread" className={tabClass(filter === 'unread')}>
          Okunmadı
          {unreadCount > 0 ? (
            <span className="rounded-full bg-cream/25 px-2 py-0.5 text-xs tabular-nums">
              {unreadCount}
            </span>
          ) : null}
        </Link>
        <Link href="/admin/contacts?filter=read" className={tabClass(filter === 'read')}>
          Okundu
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#EDE4D3] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left font-sans text-sm text-[#3D1F10]">
            <thead>
              <tr className="border-b border-[#EDE4D3] bg-[#F8F7F4] text-[13px] font-medium text-[#6B4C35]">
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">İsim</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Konu</th>
                <th className="px-4 py-3">Bütçe</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Detay</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[#6B4C35]">
                    Kayıt yok.
                  </td>
                </tr>
              ) : (
                contacts.map((row, i) => (
                  <tr
                    key={row.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(row)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelected(row);
                      }
                    }}
                    className={`cursor-pointer border-b border-[#EDE4D3]/80 transition hover:bg-[#F5F0E6]/60 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]/90'
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-[#6B4C35]">
                      {new Date(row.created_at).toLocaleString('tr-TR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="px-4 py-3">{row.email}</td>
                    <td className="max-w-[160px] truncate px-4 py-3">{row.subject || '—'}</td>
                    <td className="px-4 py-3">{row.budget || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.is_read
                            ? 'bg-[#EDE4D3]/80 text-[#6B4C35]'
                            : 'bg-[#8B3A1E]/12 text-[#8B3A1E]'
                        }`}
                      >
                        {statusLabel(row.is_read)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[#8B3A1E]">Detay</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-0 sm:p-4">
          <div
            className="absolute inset-0"
            role="presentation"
            onClick={() => setSelected(null)}
            aria-hidden
          />
          <aside
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-xl sm:max-h-[90vh] sm:rounded-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-drawer-title"
          >
            <div className="flex items-start justify-between border-b border-[#EDE4D3] px-5 py-4">
              <div>
                <h2 id="contact-drawer-title" className="font-serif text-lg text-[#3D1F10]">
                  {selected.name}
                </h2>
                <p className="mt-1 text-xs text-[#6B4C35]">{selected.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-[#EDE4D3] px-2 py-1 text-sm text-[#6B4C35] hover:bg-[#F8F7F4]"
              >
                Kapat
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 font-sans text-sm">
              <dl className="space-y-3 text-[#3D1F10]">
                <div>
                  <dt className="text-xs font-medium text-[#6B4C35]">Konu</dt>
                  <dd>{selected.subject || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-[#6B4C35]">Telefon</dt>
                  <dd>{selected.phone || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-[#6B4C35]">Bütçe</dt>
                  <dd>{selected.budget || '—'}</dd>
                </div>
                <div>
                  <dt className="mb-1 text-xs font-medium text-[#6B4C35]">Mesaj</dt>
                  <dd className="whitespace-pre-wrap rounded-lg bg-[#F8F7F4] p-3 text-[#3D1F10]">
                    {selected.message}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-[#EDE4D3] px-5 py-4">
              <a
                href={mailtoHref(selected)}
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#8B3A1E] px-4 text-sm font-medium text-cream transition hover:bg-[#6d2e18]"
              >
                Yanıtla
              </a>
              {selected.is_read ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onMarkUnread(selected.id)}
                  className="rounded-lg border border-[#EDE4D3] px-4 py-2 text-sm hover:bg-[#F8F7F4] disabled:opacity-50"
                >
                  Okunmadı yap
                </button>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onMarkRead(selected.id)}
                  className="rounded-lg border border-[#EDE4D3] px-4 py-2 text-sm hover:bg-[#F8F7F4] disabled:opacity-50"
                >
                  Okundu işaretle
                </button>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => onDelete(selected.id)}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Sil
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
