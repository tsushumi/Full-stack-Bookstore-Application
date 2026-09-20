# Kenya Bookshelf — Backend API

A REST API for a Kenyan online bookstore, built with **Express**. Books are
stocked with prices in **KES** across six categories relevant to Kenyan
readers: Fiction, Non-Fiction, Technology, Business, Self-Help, and Academic.

**Live API:** `<ADD_YOUR_RAILWAY_URL_HERE>`
**Frontend:** `<ADD_YOUR_VERCEL_URL_HERE>`

## Tech stack

- Node.js + Express 5
- `cors` for cross-origin requests
- In-memory data store (arrays) — no database required
- Custom logging + centralized error-handling middleware

## Getting started

```bash
npm install
npm start        # production
npm run dev       # auto-restart on change (node --watch)
```

The server listens on `PORT` (defaults to `5000`).

### Environment variables

| Variable      | Description                                              | Default |
| ------------- | --------------------------------------------------------- | ------- |
| `PORT`        | Port to listen on                                         | `5000`  |
| `CORS_ORIGIN` | Comma-separated list of allowed origins (e.g. Vercel URL) | `*`     |

## API documentation

Base URL (local): `http://localhost:5000`

### Health check

```
GET /api/health
```

```json
{ "status": "ok", "timestamp": "2026-09-20T12:00:00.000Z", "uptime": 12.3 }
```

### Books

| Method | Endpoint           | Description                    |
| ------ | -----------------  | -----------------------------  |
| GET    | `/api/books`       | List books                     |
| GET    | `/api/books/:id`   | Get a single book              |
| POST   | `/api/books`       | Create a book                  |
| PUT    | `/api/books/:id`   | Update a book                  |
| DELETE | `/api/books/:id`   | Delete a book                  |

**Query parameters for `GET /api/books`:**

| Param      | Example                | Description                                    |
| ---------- | ---------------------  | ---------------------------------------------- |
| `search`   | `?search=ngugi`        | Matches title or author (case-insensitive)     |
| `category` | `?category=Fiction`    | Filter by exact category                       |
| `inStock`  | `?inStock=true`        | Filter by stock status                         |
| `sort`     | `?sort=price`          | One of `title`, `author`, `price`, `createdAt` |
| `order`    | `?order=asc`           | `asc` or `desc` (default `asc`)                |
| `page`     | `?page=2`              | Page number (default `1`)                      |
| `limit`    | `?limit=10`            | Items per page (default `10`)                  |

**Response shape:**

```json
{
  "data": [ { "id": 1, "title": "...", "price": 1200, "...": "..." } ],
  "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

**Create/update body** (`POST` requires all fields, `PUT` accepts a partial body):

```json
{
  "title": "Weep Not, Child",
  "author": "Ngugi wa Thiong'o",
  "isbn": "978-0-14-018650-2",
  "price": 1200,
  "category": "Fiction",
  "description": "...",
  "coverImage": "https://...",
  "inStock": true
}
```

Categories accepted: `Fiction`, `Non-Fiction`, `Technology`, `Business`,
`Self-Help`, `Academic`.

### Categories

```
GET /api/categories
```

Returns each category name with a live count of books in it.

### Authors (stretch goal)

```
GET /api/authors
GET /api/authors/:id/books
```

`:id` is a slug of the author's name (e.g. `ngugi-wa-thiong-o`).

## Error format

All errors follow the same shape, produced by the centralized error handler:

```json
{
  "error": {
    "status": 400,
    "message": "Invalid book payload",
    "details": ["price is required"]
  }
}
```

- `404` for missing resources
- `400` for validation failures (with a `details` array)
- `500` for unexpected errors

## Middleware

- **`logger`** — logs `METHOD URL STATUS - Xms` for every request.
- **`errorHandler`** — catches errors thrown/`next()`-ed anywhere downstream
  (including inside route handlers via Express 5's automatic promise
  rejection handling) and returns a consistent JSON error body.
- **`cors`** — configured via `CORS_ORIGIN` so only the deployed frontend can
  call the API in production, while allowing all origins by default in local
  development.

# Kenya Bookshelf — Frontend

A React (Vite + Tailwind CSS) storefront for the Kenya Bookshelf API — browse
books by category, search by title/author, view details, and (bonus) add
items to a cart or manage the catalogue from an admin panel.

**Live site:** `<ADD_YOUR_VERCEL_URL_HERE>`
**Backend API:** `<ADD_YOUR_RAILWAY_URL_HERE>`

## Tech stack

- React 19 + Vite
- React Router (`react-router-dom`)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Native `fetch` for API calls (no extra HTTP library)

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Make sure the backend (`week-5-bookstore-api`)
is running on the URL set in `.env`.

## Environment variables

| Variable       | Description                            | Default                  |
| -------------- | -------------------------------------- | ------------------------ |
| `VITE_API_URL` | Base URL of the Express backend        | `http://localhost:5000`  |

## Features

- **Catalogue** — category sidebar with live counts, debounced search,
  sort by title/price/newest, server-driven pagination.
- **Book detail page** — full description, stock status, author link.
- **Responsive design** — 2-column grid on mobile up to 4-column on desktop.
- **Loading / error / empty states** on every data-fetching page.
- **Cart (stretch)** — add/remove/update quantity, total in KES, persisted
  in `localStorage`.
- **Author pages (stretch)** — click an author's name to see all their books.
- **Admin panel (stretch)** — simple password-gated (client-side demo only,
  not real auth) page to add, edit, and delete books through the UI, with
  form validation.  