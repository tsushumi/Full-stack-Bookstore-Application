import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuthorBooks } from "../api/client";
import BookCard from "../components/BookCard";
import { LoadingSpinner, ErrorMessage } from "../components/Feedback";

export default function AuthorPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getAuthorBooks(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) return <LoadingSpinner label="Loading author..." />;
  if (error)
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <ErrorMessage message={error} onRetry={load} />
      </div>
    );
  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-stone-800">{data.author}</h1>
      <p className="mb-6 text-sm text-stone-500">
        {data.books.length} book{data.books.length === 1 ? "" : "s"} in our catalogue
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
