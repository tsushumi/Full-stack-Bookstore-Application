import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getBooks, getCategories } from "../api/client";
import CategorySidebar from "../components/CategorySidebar";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import { LoadingSpinner, ErrorMessage, EmptyState } from "../components/Feedback";

const LIMIT = 12;

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(search);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === undefined || value === null) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next);
  };

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBooks({
        category: category || undefined,
        search: search || undefined,
        sort,
        order,
        page,
        limit: LIMIT,
      });
      setBooks(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, order, page]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Debounce search input -> URL param
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput, page: 1 });
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">
          {category ? category : "Browse our collection"}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          African literature, technology, business and self-help books — priced in KES.
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          sort={sort}
          order={order}
          onSortChange={(s, o) => updateParams({ sort: s, order: o, page: 1 })}
        />
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <CategorySidebar
          categories={categories}
          activeCategory={category}
          onSelect={(cat) => updateParams({ category: cat, page: 1 })}
        />

        <div className="flex-1">
          {loading && <LoadingSpinner />}
          {!loading && error && <ErrorMessage message={error} onRetry={loadBooks} />}
          {!loading && !error && books.length === 0 && (
            <EmptyState message="No books match your search. Try a different term or category." />
          )}
          {!loading && !error && books.length > 0 && (
            <>
              <p className="mb-4 text-xs text-stone-400">
                {pagination?.total} book{pagination?.total === 1 ? "" : "s"} found
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => updateParams({ page: p })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
