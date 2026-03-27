'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ColumnDef<T> = {
  id: string;
  header: string;
  accessorKey?: keyof T;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | boolean | null | undefined;
  cell?: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type DeleteCtx = {
  requestDelete: (row: unknown) => void;
};

const DeleteContext = createContext<DeleteCtx | null>(null);

export function DataTableDeleteButton<T extends object>({
  row,
  children,
  className,
}: {
  row: T;
  children?: ReactNode;
  className?: string;
}) {
  const ctx = useContext(DeleteContext);
  if (!ctx) {
    throw new Error('DataTableDeleteButton yalnızca DataTable içinde kullanılabilir.');
  }
  return (
    <button
      type="button"
      onClick={() => ctx.requestDelete(row)}
      className={
        className ??
        'rounded-lg border border-red-200 px-3 py-1.5 font-sans text-xs font-medium text-red-700 transition hover:bg-red-50'
      }
    >
      {children ?? 'Sil'}
    </button>
  );
}

type DataTableProps<T extends object> = {
  columns: ColumnDef<T>[];
  data: T[];
  getRowId: (row: T) => string;
  onDelete?: (row: T) => Promise<void> | void;
  deleteTitle?: string;
  deleteMessage?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
};

export function DataTable<T extends object>({
  columns,
  data,
  getRowId,
  onDelete,
  deleteTitle = 'Sil',
  deleteMessage = 'Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
  searchPlaceholder = 'Ara…',
  pageSize = 10,
  emptyMessage = 'Kayıt bulunamadı.',
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{
    columnId: string;
    dir: 'asc' | 'desc';
  } | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      Object.values(row as object).some((v) =>
        String(v ?? '')
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [data, query]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.id === sort.columnId);
    if (!col || !col.sortable) return filtered;

    const getVal = (row: T) => {
      if (col.sortValue) return col.sortValue(row);
      if (col.accessorKey !== undefined) return row[col.accessorKey];
      return '';
    };

    const arr = [...filtered].sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      if (typeof va === 'number' && typeof vb === 'number') {
        return sort.dir === 'asc' ? va - vb : vb - va;
      }
      const sa = String(va ?? '');
      const sb = String(vb ?? '');
      const cmp = sa.localeCompare(sb, 'tr', { numeric: true, sensitivity: 'base' });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = sorted.slice(
    (pageSafe - 1) * pageSize,
    pageSafe * pageSize,
  );

  useEffect(() => {
    setPage(1);
  }, [query, sort?.columnId, sort?.dir, filtered.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const requestDelete = useCallback(
    (row: unknown) => {
      if (onDelete) setPendingDelete(row as T);
    },
    [onDelete],
  );

  const confirmDelete = async () => {
    if (!pendingDelete || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const toggleSort = (col: ColumnDef<T>) => {
    if (!col.sortable) return;
    setSort((prev) => {
      if (!prev || prev.columnId !== col.id) {
        return { columnId: col.id, dir: 'asc' };
      }
      if (prev.dir === 'asc') return { columnId: col.id, dir: 'desc' };
      return null;
    });
  };

  const defaultCell = (row: T, col: ColumnDef<T>) => {
    if (col.cell) return col.cell(row);
    if (col.accessorKey !== undefined) {
      const v = row[col.accessorKey];
      return v == null || v === '' ? '—' : String(v);
    }
    return '—';
  };

  return (
    <DeleteContext.Provider value={{ requestDelete }}>
      <div className="space-y-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full max-w-sm rounded-lg border border-[#EDE4D3] bg-white px-3 font-sans text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E] focus:ring-1 focus:ring-[#8B3A1E]/25"
          aria-label="Tabloda ara"
        />

        <div className="overflow-hidden rounded-xl border border-[#EDE4D3] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-[#EDE4D3] bg-[#F8F7F4] font-sans text-[13px] font-medium text-[#6B4C35]">
                  {columns.map((col) => (
                    <th
                      key={col.id}
                      className={`px-4 py-3 ${col.headerClassName ?? ''} ${
                        col.sortable
                          ? 'cursor-pointer select-none hover:text-[#3D1F10]'
                          : ''
                      }`}
                      onClick={() => toggleSort(col)}
                      onKeyDown={(e) => {
                        if (col.sortable && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          toggleSort(col);
                        }
                      }}
                      tabIndex={col.sortable ? 0 : undefined}
                      role={col.sortable ? 'button' : undefined}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.header}
                        {sort?.columnId === col.id ? (
                          <span className="text-[#8B3A1E]" aria-hidden>
                            {sort.dir === 'asc' ? '↑' : '↓'}
                          </span>
                        ) : null}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-sans text-sm text-[#3D1F10]">
                {pageRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-10 text-center text-[#6B4C35]"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row, i) => (
                    <tr
                      key={getRowId(row)}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]/90'}
                    >
                      {columns.map((col) => (
                        <td
                          key={col.id}
                          className={`border-b border-[#EDE4D3]/80 px-4 py-3 ${col.cellClassName ?? ''}`}
                        >
                          {defaultCell(row, col)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 font-sans text-sm text-[#6B4C35]">
          <span>
            {sorted.length === 0
              ? '0 kayıt'
              : `${(pageSafe - 1) * pageSize + 1}–${Math.min(pageSafe * pageSize, sorted.length)} / ${sorted.length}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pageSafe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-[#EDE4D3] bg-white px-3 py-1.5 text-[#3D1F10] transition hover:bg-[#F5F0E6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Önceki
            </button>
            <span className="tabular-nums">
              {pageSafe} / {totalPages}
            </span>
            <button
              type="button"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-[#EDE4D3] bg-white px-3 py-1.5 text-[#3D1F10] transition hover:bg-[#F5F0E6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>

      {pendingDelete && onDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="datatable-delete-title"
        >
          <div className="max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2
              id="datatable-delete-title"
              className="font-sans text-lg font-semibold text-[#3D1F10]"
            >
              {deleteTitle}
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-[#6B4C35]">
              {deleteMessage}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                className="rounded-lg border border-[#EDE4D3] px-4 py-2 font-sans text-sm font-medium text-[#3D1F10] transition hover:bg-[#F8F7F4]"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Siliniyor…' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DeleteContext.Provider>
  );
}
