'use client';

import type { Contact } from '@/types';
import { Fragment, useState } from 'react';

type Props = {
  contacts: Contact[];
  markReadAction: (formData: FormData) => Promise<void>;
};

export function DashboardRecentContacts({
  contacts,
  markReadAction,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (contacts.length === 0) {
    return (
      <div className="rounded-xl bg-white px-4 py-12 text-center font-sans text-sm text-[#6B4C35]">
        Henüz mesaj yok.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-[#EDE4D3] text-[13px] font-medium text-[#6B4C35]">
              <th className="px-4 py-3 font-sans">İsim</th>
              <th className="px-4 py-3 font-sans">Konu</th>
              <th className="px-4 py-3 font-sans">Tarih</th>
              <th className="px-4 py-3 font-sans">Durum</th>
              <th className="w-[140px] px-4 py-3 font-sans">İşlem</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm text-[#3D1F10]">
            {contacts.map((row, i) => {
              const open = openId === row.id;
              return (
                <Fragment key={row.id}>
                  <tr
                    className={i % 2 === 0 ? 'bg-[#FAFAF8]/80' : 'bg-white'}
                  >
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="max-w-[200px] truncate px-4 py-3">
                      {row.subject || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#6B4C35]">
                      {new Date(row.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {row.is_read ? (
                        <span className="inline-flex rounded-full bg-[#EDE4D3] px-2.5 py-0.5 text-[11px] font-medium text-[#6B4C35]">
                          Okundu
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-[#7A9E6E]/15 px-2.5 py-0.5 text-[11px] font-medium text-[#5c7a52]">
                          Yeni
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : row.id)}
                        className="rounded-lg border border-[#EDE4D3] bg-white px-3 py-1.5 text-xs font-medium text-[#8B3A1E] transition hover:border-[#8B3A1E]/40 hover:bg-[#F5F0E6]"
                      >
                        {open ? 'Gizle' : 'Gör'}
                      </button>
                    </td>
                  </tr>
                  {open ? (
                    <tr
                      key={`${row.id}-detail`}
                      className={i % 2 === 0 ? 'bg-[#FAFAF8]/80' : 'bg-white'}
                    >
                      <td colSpan={5} className="border-b border-[#EDE4D3] px-4 pb-4 pt-0">
                        <div className="rounded-lg border border-[#EDE4D3] bg-white p-4 text-sm">
                          <dl className="grid gap-2 text-[#3D1F10] sm:grid-cols-2">
                            <div>
                              <dt className="text-[11px] uppercase tracking-wide text-[#6B4C35]">
                                E-posta
                              </dt>
                              <dd>
                                <a
                                  href={`mailto:${row.email}`}
                                  className="text-[#8B3A1E] hover:underline"
                                >
                                  {row.email}
                                </a>
                              </dd>
                            </div>
                            {row.phone ? (
                              <div>
                                <dt className="text-[11px] uppercase tracking-wide text-[#6B4C35]">
                                  Telefon
                                </dt>
                                <dd>{row.phone}</dd>
                              </div>
                            ) : null}
                            {row.budget ? (
                              <div>
                                <dt className="text-[11px] uppercase tracking-wide text-[#6B4C35]">
                                  Bütçe
                                </dt>
                                <dd>{row.budget}</dd>
                              </div>
                            ) : null}
                          </dl>
                          <div className="mt-3">
                            <p className="text-[11px] uppercase tracking-wide text-[#6B4C35]">
                              Mesaj
                            </p>
                            <p className="mt-1 whitespace-pre-wrap leading-relaxed text-[#3D1F10]">
                              {row.message}
                            </p>
                          </div>
                          {!row.is_read ? (
                            <form action={markReadAction} className="mt-4">
                              <input type="hidden" name="id" value={row.id} />
                              <button
                                type="submit"
                                className="rounded-lg bg-[#8B3A1E] px-4 py-2 text-xs font-semibold text-[#F5F0E6] transition hover:bg-[#6B2C14]"
                              >
                                Okundu işaretle
                              </button>
                            </form>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
