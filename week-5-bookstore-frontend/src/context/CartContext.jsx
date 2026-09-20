import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "bookstore-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [items]);

  function addToCart(book, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === book.id);
      if (existing) {
        return prev.map((i) =>
          i.id === book.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          coverImage: book.coverImage,
          quantity,
        },
      ];
    });
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id, quantity) {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items]
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
