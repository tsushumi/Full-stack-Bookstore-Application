import { useEffect, useState } from "react";
import { createBook, deleteBook, getBooks, updateBook } from "../api/client";
import { formatKES } from "../utils/format";
import { LoadingSpinner, ErrorMessage } from "../components/Feedback";

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Technology",
  "Business",
  "Self-Help",
  "Academic",
];

const EMPTY_FORM = {
  title: "",
  author: "",
  isbn: "",
  price: "",
  category: CATEGORIES[0],
  description: "",
  coverImage: "",
  inStock: true,
};

// Simple client-side gate for the admin panel demo.
// This is NOT real authentication — it only hides the UI, since this project
// has no user/auth system. In a production app this route would be protected
// by a real login and a server-verified session/token.
const ADMIN_PASSWORD = "bookstore-admin";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("admin-unlocked") === "true"
  );
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    getBooks({ limit: 100, sort: "createdAt", order: "desc" })
      .then((res) => setBooks(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (unlocked) load();
  }, [unlocked]);

  function handleUnlock(e) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin-unlocked", "true");
      setUnlocked(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password.");
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormErrors([]);
  }

  function startEdit(book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: String(book.price),
      category: book.category,
      description: book.description,
      coverImage: book.coverImage,
      inStock: book.inStock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validate() {
    const errs = [];
    if (!form.title.trim()) errs.push("Title is required");
    if (!form.author.trim()) errs.push("Author is required");
    if (!form.isbn.trim()) errs.push("ISBN is required");
    if (!form.price || Number.isNaN(Number(form.price)) || Number(form.price) < 0)
      errs.push("Price must be a positive number");
    if (!form.description.trim()) errs.push("Description is required");
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setFormErrors(errs);
    if (errs.length > 0) return;

    setSaving(true);
    const payload = { ...form, price: Number(form.price) };

    try {
      if (editingId) {
        await updateBook(editingId, payload);
      } else {
        await createBook(payload);
      }
      resetForm();
      load();
    } catch (err) {
      setFormErrors([err.message]);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20">
        <h1 className="mb-4 text-xl font-bold text-stone-800">Admin login</h1>
        <form onSubmit={handleUnlock} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="rounded-lg border border-[#e8dfd2] bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]"
          />
          {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-dark)]"
          >
            Unlock
          </button>
          <p className="text-xs text-stone-400">
            Demo password: <code className="rounded bg-stone-100 px-1">{ADMIN_PASSWORD}</code>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-stone-800">Admin panel</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-10 grid grid-cols-1 gap-3 rounded-xl border border-[#e8dfd2] bg-white p-5 shadow-sm sm:grid-cols-2"
      >
        <h2 className="col-span-full text-sm font-bold uppercase tracking-wide text-stone-500">
          {editingId ? "Edit book" : "Add a new book"}
        </h2>

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-[#e8dfd2] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="rounded-lg border border-[#e8dfd2] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
        />
        <input
          placeholder="ISBN"
          value={form.isbn}
          onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          className="rounded-lg border border-[#e8dfd2] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
        />
        <input
          placeholder="Price (KES)"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="rounded-lg border border-[#e8dfd2] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded-lg border border-[#e8dfd2] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          placeholder="Cover image URL (optional)"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          className="rounded-lg border border-[#e8dfd2] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="col-span-full rounded-lg border border-[#e8dfd2] px-3 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
        />
        <label className="flex items-center gap-2 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
          />
          In stock
        </label>

        {formErrors.length > 0 && (
          <ul className="col-span-full list-disc pl-5 text-xs text-red-600">
            {formErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        <div className="col-span-full flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-dark)] disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update book" : "Add book"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-[#e8dfd2] px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-[#f1e8da]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && <LoadingSpinner label="Loading books..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-[#e8dfd2] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e8dfd2] bg-[#f9f4eb] text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-[#f1e8da] last:border-0">
                  <td className="px-4 py-3 font-medium text-stone-800">{book.title}</td>
                  <td className="px-4 py-3 text-stone-600">{book.author}</td>
                  <td className="px-4 py-3 text-stone-600">{book.category}</td>
                  <td className="px-4 py-3 text-stone-600">{formatKES(book.price)}</td>
                  <td className="px-4 py-3 text-stone-600">
                    {book.inStock ? "In stock" : "Out of stock"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(book)}
                      className="mr-3 text-xs font-semibold text-[var(--color-brand)] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
