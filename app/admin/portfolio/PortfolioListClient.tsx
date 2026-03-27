'use client';

import {
  DataTable,
  DataTableDeleteButton,
  type ColumnDef,
} from '@/components/admin/DataTable';
import { portfolioCategoryLabel } from '@/lib/portfolio-category-labels';
import type { PortfolioItem } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  deletePortfolioItem,
  reorderPortfolioItem,
  setPortfolioToggle,
} from './actions';

type Props = {
  items: PortfolioItem[];
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

export function PortfolioListClient({ items: initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const patchRow = (id: string, patch: Partial<PortfolioItem>) => {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  };

  const toggle = (
    row: PortfolioItem,
    field: 'is_featured' | 'is_active',
    next: boolean,
  ) => {
    const prev = row[field];
    patchRow(row.id, { [field]: next });
    startTransition(async () => {
      try {
        await setPortfolioToggle(row.id, field, next);
        router.refresh();
      } catch {
        patchRow(row.id, { [field]: prev });
      }
    });
  };

  const move = (row: PortfolioItem, direction: 'up' | 'down') => {
    startTransition(async () => {
      await reorderPortfolioItem(row.id, direction);
      router.refresh();
    });
  };

  const onDelete = async (row: PortfolioItem) => {
    await deletePortfolioItem(row.id);
    router.refresh();
  };

  const ordered = useMemo(
    () => [...items].sort((a, b) => a.order_index - b.order_index),
    [items],
  );
  const indexOf = (id: string) => ordered.findIndex((r) => r.id === id);

  const columns: ColumnDef<PortfolioItem>[] = [
    {
      id: 'order',
      header: 'Sıra',
      sortable: true,
      sortValue: (r) => r.order_index,
      cell: (row) => {
        const idx = indexOf(row.id);
        return (
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="Yukarı"
              disabled={pending || idx <= 0}
              onClick={() => move(row, 'up')}
              className="rounded border border-[#EDE4D3] px-2 py-1 text-xs text-[#3D1F10] hover:bg-[#F5F0E6] disabled:opacity-40"
            >
              ↑
            </button>
            <button
              type="button"
              title="Aşağı"
              disabled={pending || idx < 0 || idx >= ordered.length - 1}
              onClick={() => move(row, 'down')}
              className="rounded border border-[#EDE4D3] px-2 py-1 text-xs text-[#3D1F10] hover:bg-[#F5F0E6] disabled:opacity-40"
            >
              ↓
            </button>
            <span className="ml-1 tabular-nums text-[#6B4C35]">
              {row.order_index}
            </span>
          </div>
        );
      },
    },
    {
      id: 'title_tr',
      header: 'Başlık (TR)',
      accessorKey: 'title_tr',
      sortable: true,
    },
    {
      id: 'category',
      header: 'Kategori',
      sortable: true,
      sortValue: (r) => r.category ?? '',
      cell: (r) => portfolioCategoryLabel(r.category),
    },
    {
      id: 'featured',
      header: 'Öne Çıkan',
      cell: (row) => (
        <ToggleSwitch
          checked={Boolean(row.is_featured)}
          busy={pending}
          onToggle={() => toggle(row, 'is_featured', !row.is_featured)}
        />
      ),
    },
    {
      id: 'active',
      header: 'Aktif',
      cell: (row) => (
        <ToggleSwitch
          checked={Boolean(row.is_active)}
          busy={pending}
          onToggle={() => toggle(row, 'is_active', !row.is_active)}
        />
      ),
    },
    {
      id: 'edit',
      header: 'Düzenle',
      cell: (row) => (
        <Link
          href={`/admin/portfolio/edit/${row.id}`}
          className="rounded-lg border border-[#EDE4D3] px-3 py-1.5 font-sans text-xs font-medium text-[#8B3A1E] transition hover:bg-[#F5F0E6]"
        >
          Düzenle
        </Link>
      ),
    },
    {
      id: 'delete',
      header: 'Sil',
      cell: (row) => <DataTableDeleteButton row={row} />,
    },
  ];

  return (
    <DataTable<PortfolioItem>
      columns={columns}
      data={ordered}
      getRowId={(r) => r.id}
      onDelete={onDelete}
      deleteTitle="Portfolyo öğesini sil"
      deleteMessage="Bu portfolyo kaydını silmek istediğinize emin misiniz?"
      searchPlaceholder="Tüm alanlarda ara…"
      pageSize={10}
      emptyMessage="Henüz portfolyo öğesi yok."
    />
  );
}
