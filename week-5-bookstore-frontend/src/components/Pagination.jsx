export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-[#e8dfd2] bg-white px-3 py-2 text-sm font-medium text-stone-600 disabled:opacity-40"
      >
        ← Prev
      </button>

      {start > 1 && <span className="px-2 text-stone-400">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`min-w-[2.25rem] rounded-lg px-3 py-2 text-sm font-medium ${
            p === page
              ? "bg-[var(--color-brand)] text-white"
              : "border border-[#e8dfd2] bg-white text-stone-600 hover:bg-[#f1e8da]"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && <span className="px-2 text-stone-400">…</span>}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border border-[#e8dfd2] bg-white px-3 py-2 text-sm font-medium text-stone-600 disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  );
}
