import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatKES } from "../utils/format";
import { EmptyState } from "../components/Feedback";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState message="Your cart is empty." />
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-[var(--color-brand)] hover:underline"
          >
            ← Continue browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-stone-800">Your cart</h1>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-[#e8dfd2] bg-white p-3 shadow-sm"
          >
            <img
              src={item.coverImage}
              alt={item.title}
              className="h-20 w-14 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <Link
                to={`/books/${item.id}`}
                className="line-clamp-1 text-sm font-semibold text-stone-800 hover:text-[var(--color-brand)]"
              >
                {item.title}
              </Link>
              <p className="text-xs text-stone-500">{item.author}</p>
              <p className="mt-1 text-sm font-bold text-[var(--color-brand-dark)]">
                {formatKES(item.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-7 w-7 rounded-full border border-[#e8dfd2] text-stone-600 hover:bg-[#f1e8da]"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-7 w-7 rounded-full border border-[#e8dfd2] text-stone-600 hover:bg-[#f1e8da]"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="ml-2 text-xs font-medium text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#e8dfd2] pt-4">
        <button
          onClick={clearCart}
          className="text-sm font-medium text-stone-500 hover:text-red-600"
        >
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-xs text-stone-500">Total</p>
          <p className="text-xl font-bold text-[var(--color-brand-dark)]">
            {formatKES(totalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
