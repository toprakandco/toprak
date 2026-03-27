'use client';

import {
  DataTable,
  DataTableDeleteButton,
  type ColumnDef,
} from '@/components/admin/DataTable';
import type { Client } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import {
  createClientRow,
  deleteClientRow,
  setClientActive,
} from './actions';

type Props = {
  clients: Client[];
};

function ToggleSwitch({
  checked,
  onToggle,
  busy,
}: {
  checked: boolean;
  onToggle: () => void;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={busy}
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? 'bg-[#8B3A1E]' : 'bg-[#EDE4D3]'
      } ${busy ? 'opacity-60' : ''}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export function ClientsListClient({ clients: initialClients }: Props) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [showAdd, setShowAdd] = useState(false);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  const patchRow = (id: string, patch: Partial<Client>) => {
    setClients((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const toggleActive = (row: Client, next: boolean) => {
    const prev = row.is_active;
    patchRow(row.id, { is_active: next });
    startTransition(async () => {
      try {
        await setClientActive(row.id, next);
        router.refresh();
      } catch {
        patchRow(row.id, { is_active: prev });
      }
    });
  };

  const onDelete = async (row: Client) => {
    await deleteClientRow(row.id);
    router.refresh();
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      await createClientRow({
        name: name.trim(),
        logo_url: logoUrl.trim() || null,
        website_url: websiteUrl.trim() || null,
        order_index: Number.isFinite(orderIndex) ? orderIndex : 0,
        is_active: isActive,
      });
      setName('');
      setLogoUrl('');
      setWebsiteUrl('');
      setOrderIndex(0);
      setIsActive(true);
      setShowAdd(false);
      router.refresh();
    });
  };

  const columns: ColumnDef<Client>[] = [
    {
      id: 'logo',
      header: 'Logo',
      cell: (row) =>
        row.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.logo_url}
            alt=""
            className="h-10 w-10 object-contain"
          />
        ) : (
          '—'
        ),
    },
    {
      id: 'name',
      header: 'İsim',
      sortable: true,
      sortValue: (r) => r.name,
      accessorKey: 'name',
    },
    {
      id: 'website',
      header: 'Website',
      cell: (row) =>
        row.website_url ? (
          <a
            href={row.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B3A1E] underline-offset-2 hover:underline"
          >
            {row.website_url.replace(/^https?:\/\//, '').slice(0, 40)}
            {row.website_url.length > 48 ? '…' : ''}
          </a>
        ) : (
          '—'
        ),
    },
    {
      id: 'order',
      header: 'Sıra',
      sortable: true,
      sortValue: (r) => r.order_index,
      accessorKey: 'order_index',
    },
    {
      id: 'active',
      header: 'Aktif',
      cell: (row) => (
        <ToggleSwitch
          checked={Boolean(row.is_active)}
          busy={pending}
          onToggle={() => toggleActive(row, !row.is_active)}
        />
      ),
    },
    {
      id: 'actions',
      header: 'İşlem',
      cell: (row) => <DataTableDeleteButton row={row} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex min-h-[44px] items-center rounded-lg bg-terracotta px-4 text-sm text-cream transition hover:bg-terracotta-dark"
        >
          {showAdd ? 'Formu kapat' : 'Yeni Müşteri Ekle'}
        </button>
      </div>

      {showAdd ? (
        <form
          onSubmit={submitAdd}
          className="rounded-xl border border-[#EDE4D3] bg-[#F8F7F4] p-5 font-sans text-sm"
        >
          <p className="mb-4 font-medium text-[#3D1F10]">Yeni müşteri</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-1">
              <span className="text-[#6B4C35]">İsim *</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full rounded-lg border border-[#EDE4D3] bg-white px-3"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[#6B4C35]">Logo adresi</span>
              <input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="h-11 w-full rounded-lg border border-[#EDE4D3] bg-white px-3"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[#6B4C35]">Web sitesi adresi</span>
              <input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="h-11 w-full rounded-lg border border-[#EDE4D3] bg-white px-3"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[#6B4C35]">Sıra</span>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="h-11 w-full rounded-lg border border-[#EDE4D3] bg-white px-3"
              />
            </label>
            <label className="flex items-center gap-2 pt-7">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-[#EDE4D3]"
              />
              <span className="text-[#3D1F10]">Aktif</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-[#3D1F10] px-5 text-sm text-cream transition hover:bg-[#2a160c] disabled:opacity-50"
          >
            {pending ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </form>
      ) : null}

      <DataTable<Client>
        columns={columns}
        data={clients}
        getRowId={(r) => r.id}
        onDelete={onDelete}
        deleteTitle="Müşteriyi sil"
        deleteMessage="Bu kaydı silmek istediğinize emin misiniz?"
        searchPlaceholder="İsim veya URL ara…"
        pageSize={15}
      />
    </div>
  );
}
