// Central place for talking to the bookstore backend.
// The base URL is read from an env var so it can point at Railway in prod
// and localhost in development.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body (e.g. network failure before response)
  }

  if (!res.ok) {
    const message = body?.error?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.details = body?.error?.details;
    throw error;
  }

  return body;
}

export function getBooks(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  const qs = query.toString();
  return request(`/api/books${qs ? `?${qs}` : ""}`);
}

export function getBook(id) {
  return request(`/api/books/${id}`);
}

export function createBook(payload) {
  return request(`/api/books`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBook(id, payload) {
  return request(`/api/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteBook(id) {
  return request(`/api/books/${id}`, { method: "DELETE" });
}

export function getCategories() {
  return request(`/api/categories`);
}

export function getAuthorBooks(authorId) {
  return request(`/api/authors/${authorId}/books`);
}

export { API_BASE_URL };
