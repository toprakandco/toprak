'use client';

import {
  DataTable,
  DataTableDeleteButton,
  type ColumnDef,
} from '@/components/admin/DataTable';
import type { BlogPost } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { deleteBlogPost, setBlogPublished } from './actions';

type Props = {
  posts: BlogPost[];
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

export function BlogListClient({ posts: initialPosts }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const patchRow = (id: string, patch: Partial<BlogPost>) => {
    setPosts((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const togglePublished = (row: BlogPost, next: boolean) => {
    const prev = row.is_published;
    patchRow(row.id, { is_published: next });
    startTransition(async () => {
      try {
        await setBlogPublished(row.id, next);
        router.refresh();
      } catch {
        patchRow(row.id, { is_published: prev });
      }
    });
  };

  const onDelete = async (row: BlogPost) => {
    await deleteBlogPost(row.id);
    router.refresh();
  };

  const columns: ColumnDef<BlogPost>[] = [
    {
      id: 'title',
      header: 'Başlık',
      sortable: true,
      sortValue: (r) => r.title_tr,
      cell: (r) => (
        <span className="font-medium text-[#3D1F10]">{r.title_tr}</span>
      ),
    },
    {
      id: 'published_at',
      header: 'Yayın Tarihi',
      sortable: true,
      sortValue: (r) => r.published_at ?? '',
      cell: (r) =>
        r.published_at
          ? new Date(r.published_at).toLocaleString('tr-TR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })
          : '—',
    },
    {
      id: 'is_published',
      header: 'Yayınlandı',
      cell: (row) => (
        <ToggleSwitch
          checked={Boolean(row.is_published)}
          busy={pending}
          onToggle={() => togglePublished(row, !row.is_published)}
        />
      ),
    },
    {
      id: 'edit',
      header: 'Düzenle',
      cell: (row) => (
        <Link
          href={`/admin/blog/edit/${row.id}`}
          className="rounded-lg border border-[#EDE4D3] px-3 py-1.5 font-sans text-xs font-medium text-[#3D1F10] transition hover:bg-[#F5F0E6]"
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
    <DataTable<BlogPost>
      columns={columns}
      data={posts}
      getRowId={(r) => r.id}
      onDelete={onDelete}
      deleteTitle="Yazıyı sil"
      deleteMessage="Bu blog yazısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      searchPlaceholder="Başlıkta ara…"
      pageSize={10}
    />
  );
}
