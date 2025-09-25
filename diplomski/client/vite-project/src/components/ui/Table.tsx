import React from 'react';

type SortDir = 'asc' | 'desc' | null;

export type Column<T> = {
  key: keyof T | string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  searchableFields?: (keyof T)[];
  initialSort?: { key: keyof T | string; dir: Exclude<SortDir, null> };
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchPlaceholder?: string;
};

export function Table<T extends Record<string, any>>({
  data,
  columns,
  searchableFields,
  initialSort,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
  searchPlaceholder = 'Pretraga…',
}: TableProps<T>) {
  const [q, setQ] = React.useState('');
  const [sortKey, setSortKey] = React.useState<string | keyof T | null>(initialSort?.key ?? null);
  const [sortDir, setSortDir] = React.useState<SortDir>(initialSort?.dir ?? null);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [page, setPage] = React.useState(1);

  // Filter
  const filtered = React.useMemo(() => {
    if (!q.trim()) return data;
    const term = q.toLowerCase();
    const fields = searchableFields ?? (columns.map(c => c.key).filter(Boolean) as (keyof T)[]);
    return data.filter(row => fields.some(f => String(row[f] ?? '').toLowerCase().includes(term)));
  }, [q, data, searchableFields, columns]);

  // Sort
  const sorted = React.useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];
      let res = 0;
      if (typeof av === 'number' && typeof bv === 'number') res = av - bv;
      else res = String(av ?? '').localeCompare(String(bv ?? ''), 'sr');
      return sortDir === 'asc' ? res : -res;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const curPage = Math.min(page, pages);
  const start = (curPage - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);

  function toggleSort(key: string | keyof T) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else {
      setSortDir(prev => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
      if (sortDir === 'desc') setSortKey(null);
    }
    setPage(1);
  }

  return (
    <div>
      <div className="tbl__toolbar">
        <input
          className="tbl__search"
          placeholder={searchPlaceholder}
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
        />
        <div className="tbl__pages">
          <label>
            Prikaz:{' '}
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {pageSizeOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button className="tbl__btn" onClick={() => setPage(1)} disabled={curPage === 1}>«</button>
          <button className="tbl__btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={curPage === 1}>‹</button>
          <span>Strana {curPage}/{pages}</span>
          <button className="tbl__btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={curPage === pages}>›</button>
          <button className="tbl__btn" onClick={() => setPage(pages)} disabled={curPage === pages}>»</button>
        </div>
      </div>

      <table className="tbl">
        <thead>
          <tr>
            {columns.map(col => {
              const sortable = col.sortable ?? true;
              const isActive = sortKey === col.key && sortDir;
              const cls = sortable
                ? `tbl__th-sort ${isActive ? (sortDir === 'asc' ? 'tbl__th-sort--asc' : 'tbl__th-sort--desc') : ''}`
                : '';
              return (
                <th key={String(col.key)}>
                  {sortable ? (
                    <span className={cls} onClick={() => toggleSort(col.key)}>
                      {col.header}
                    </span>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {paged.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={String(col.key)}>
                  {col.accessor ? col.accessor(row) : String(row[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {paged.length === 0 && (
            <tr>
              <td colSpan={columns.length}>Nema rezultata.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Omogućimo oba načina importa:
export default Table;
export { Table as Tabela };
