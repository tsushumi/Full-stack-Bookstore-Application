import { Link } from "react-router-dom";
import { formatKES } from "../utils/format";

export default function BookCard({ book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#e8dfd2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-stone-100">
        <img
          src={book.coverImage}
          alt={book.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {!book.inStock && (
          <span className="absolute right-2 top-2 rounded-full bg-stone-800/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Out of stock
          </span>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-brand-dark)]">
          {book.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-stone-800">
          {book.title}
        </h3>
        <p className="text-xs text-stone-500">{book.author}</p>
        <p className="mt-auto pt-2 text-sm font-bold text-[var(--color-brand-dark)]">
          {formatKES(book.price)}
        </p>
      </div>
    </Link>
  );
}
