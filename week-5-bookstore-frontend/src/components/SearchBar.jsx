export default function SearchBar({ value, onChange, sort, order, onSortChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
          🔍
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full rounded-lg border border-[#e8dfd2] bg-white py-2.5 pl-10 pr-4 text-sm text-stone-800 shadow-sm outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]"
        />
      </div>
      <select
        value={`${sort}-${order}`}
        onChange={(e) => {
          const [s, o] = e.target.value.split("-");
          onSortChange(s, o);
        }}
        className="rounded-lg border border-[#e8dfd2] bg-white px-3 py-2.5 text-sm text-stone-700 shadow-sm outline-none focus:border-[var(--color-brand)]"
      >
        <option value="createdAt-desc">Newest first</option>
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
