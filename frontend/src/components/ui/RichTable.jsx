import { useMemo, useState } from 'react';

const defaultGetRowId = (row) => row.id ?? row._id ?? JSON.stringify(row);

const StatusBadge = ({ status }) => {
  const s = (status || '').toLowerCase();
  let tone = 'neutral';
  if (s.includes('complete') || s.includes('completed') || s.includes('achieved')) tone = 'good';
  else if (s.includes('pending') || s.includes('await')) tone = 'warn';
  else if (s.includes('reject') || s.includes('returned')) tone = 'bad';
  else if (s.includes('submitted') || s.includes('in progress') || s.includes('progress')) tone = 'info';

  const styles = {
    good: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warn: 'bg-amber-100 text-amber-900 border-amber-200',
    bad: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[tone] || styles.neutral}`}
    >
      {status || '—'}
    </span>
  );
};

const ProgressCell = ({ value }) => {
  const n = Number(value);
  const pct = Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;

  return (
    <div className="min-w-[10rem]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{Number.isFinite(n) ? `${pct}%` : '—'}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const RichTable = ({
  columns = [],
  rows = [],
  searchable = true,
  filterable = false,
  initialPageSize = 6,
  statusColumnKey = 'status',
  onRowClick,
}) => {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState(columns?.[0]?.key || '');
  const [sortDir, setSortDir] = useState('asc');
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1);

  const rowId = (row) => defaultGetRowId(row);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      return columns.some((c) => {
        const v = r?.[c.key];
        return String(v ?? '').toLowerCase().includes(q);
      });
    });
  }, [query, rows, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const dir = sortDir === 'desc' ? -1 : 1;

    const col = columns.find((c) => c.key === sortKey);
    const isNumeric = col?.type === 'number' || sortKey.toLowerCase().includes('progress') || sortKey.toLowerCase().includes('value');

    return [...filtered].sort((a, b) => {
      const av = a?.[sortKey];
      const bv = b?.[sortKey];
      if (isNumeric) {
        return (Number(av) - Number(bv)) * dir;
      }
      return String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true }) * dir;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage, pageSize]);

  const handleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    }
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 sm:w-80"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Rows</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {[5, 6, 8, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <table className="min-w-[720px] w-full border-collapse">
          <thead className="bg-slate-50 text-left dark:bg-slate-900">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="cursor-pointer select-none px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300"
                  onClick={() => handleSort(c.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{c.label}</span>
                    {sortKey === c.key && (
                      <span className="text-slate-400">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  No results.
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr
                  key={rowId(r)}
                  className={`transition ${onRowClick ? 'hover:bg-slate-50 dark:hover:bg-slate-900' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(r)}
                >
                  {columns.map((c) => {
                    const v = r?.[c.key];
                    const cellKey = `${rowId(r)}-${c.key}`;

                    if (c.key === statusColumnKey) {
                      return (
                        <td key={cellKey} className="px-4 py-3">
                          <StatusBadge status={v} />
                        </td>
                      );
                    }

                    if (c.key === 'progress') {
                      return (
                        <td key={cellKey} className="px-4 py-3">
                          <ProgressCell value={v} />
                        </td>
                      );
                    }

                    return (
                      <td key={cellKey} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                        {c.key === 'updatedAt' && v ? new Date(v).toLocaleDateString() : String(v ?? '—')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Showing <span className="font-semibold">{paginated.length}</span> of{' '}
          <span className="font-semibold">{sorted.length}</span> results
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            disabled={safePage === 1}
            onClick={() => setPage(1)}
          >
            First
          </button>
          <button
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Page <span className="font-semibold">{safePage}</span> / {totalPages}
          </span>
          <button
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
          <button
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            disabled={safePage === totalPages}
            onClick={() => setPage(totalPages)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default RichTable;

