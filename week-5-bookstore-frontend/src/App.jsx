import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CatalogPage from "./pages/CatalogPage";
import BookDetailPage from "./pages/BookDetailPage";
import AuthorPage from "./pages/AuthorPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/authors/:id" element={<AuthorPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-xl px-4 py-24 text-center">
                <p className="text-lg font-semibold text-stone-700">Page not found</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
