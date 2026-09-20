import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBook } from "../api/client";
import { useCart } from "../context/CartContext";
import { formatKES } from "../utils/format";
import { LoadingSpinner, ErrorMessage } from "../components/Feedback";

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    getBook(id)
      .then((res) => setBook(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) return <LoadingSpinner label="Loading book..." />;
  if (error)
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ErrorMessage message={error} onRetry={load} />
      </div>
    );
  if (!book) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm font-medium text-stone-500 hover:text-[var(--color-brand)]"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[240px_1fr]">
        <div className="relative">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full rounded-xl border border-[#e8dfd2] object-cover shadow-sm"
          />
          {!book.inStock && (
            <span className="absolute right-2 top-2 rounded-full bg-stone-800/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Out of stock
            </span>
          )}
        </div>

        <div>
          <span className="rounded-full bg-[#f1e8da] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-dark)]">
            {book.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-stone-800">{book.title}</h1>
          <Link
            to={`/authors/${slugify(book.author)}`}
            className="mt-1 inline-block text-sm text-stone-500 hover:text-[var(--color-brand)] hover:underline"
          >
            by {book.author}
          </Link>

          <p className="mt-4 text-2xl font-bold text-[var(--color-brand-dark)]">
            {formatKES(book.price)}
          </p>

          <p className="mt-4 leading-relaxed text-stone-600">{book.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm text-stone-500">
            <div>
              <dt className="font-semibold text-stone-700">ISBN</dt>
              <dd>{book.isbn}</dd>
            </div>
            <div>
              <dt className="font-semibold text-stone-700">Availability</dt>
              <dd>{book.inStock ? "In stock" : "Out of stock"}</dd>
            </div>
          </dl>

          <button
            disabled={!book.inStock}
            onClick={() => {
              addToCart(book);
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            className="mt-6 rounded-lg bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-brand-dark)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {added ? "Added to cart ✓" : book.inStock ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
