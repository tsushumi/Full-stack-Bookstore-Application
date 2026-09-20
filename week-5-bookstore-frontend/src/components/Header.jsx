import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-[#e8dfd2] bg-[#faf7f2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="text-lg font-bold tracking-tight text-[var(--color-ink)]">
            Kenya Book<span className="text-[var(--color-brand)]">shelf</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium text-stone-600">
          <Link to="/" className="hover:text-[var(--color-brand)]">
            Catalogue
          </Link>
          <Link to="/admin" className="hover:text-[var(--color-brand)]">
            Admin
          </Link>
          <Link
            to="/cart"
            className="relative flex items-center gap-1 rounded-full bg-[var(--color-brand)] px-4 py-2 text-white shadow-sm transition hover:bg-[var(--color-brand-dark)]"
          >
            🛒 Cart
            {totalItems > 0 && (
              <span className="ml-1 rounded-full bg-white px-2 text-xs font-bold text-[var(--color-brand)]">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
