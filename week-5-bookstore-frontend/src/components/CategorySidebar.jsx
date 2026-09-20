export default function CategorySidebar({ categories, activeCategory, onSelect }) {
  return (
    <aside className="w-full shrink-0 md:w-56">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
        Categories
      </h3>
      <ul className="flex flex-wrap gap-2 md:flex-col md:gap-1">
        <li>
          <button
            onClick={() => onSelect("")}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              activeCategory === ""
                ? "bg-[var(--color-brand)] text-white"
                : "bg-white text-stone-700 hover:bg-[#f1e8da]"
            }`}
          >
            All Books
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.name}>
            <button
              onClick={() => onSelect(cat.name)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                activeCategory === cat.name
                  ? "bg-[var(--color-brand)] text-white"
                  : "bg-white text-stone-700 hover:bg-[#f1e8da]"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-xs ${
                  activeCategory === cat.name ? "text-white/80" : "text-stone-400"
                }`}
              >
                {cat.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
