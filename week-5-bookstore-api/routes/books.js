const express = require("express");
const router = express.Router();
const { books, getNextId } = require("../data/books");
const { NotFoundError, ValidationError } = require("../middleware/errorHandler");

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Technology",
  "Business",
  "Self-Help",
  "Academic",
];

const SORTABLE_FIELDS = ["title", "author", "price", "createdAt"];

// ---- Validation helpers ----

function validateBookPayload(payload, { partial = false } = {}) {
  const errors = [];
  const required = [
    "title",
    "author",
    "isbn",
    "price",
    "category",
    "description",
  ];

  if (!partial) {
    for (const field of required) {
      if (
        payload[field] === undefined ||
        payload[field] === null ||
        payload[field] === ""
      ) {
        errors.push(`${field} is required`);
      }
    }
  }

  if (payload.title !== undefined && typeof payload.title !== "string") {
    errors.push("title must be a string");
  }
  if (payload.author !== undefined && typeof payload.author !== "string") {
    errors.push("author must be a string");
  }
  if (payload.isbn !== undefined && typeof payload.isbn !== "string") {
    errors.push("isbn must be a string");
  }
  if (payload.description !== undefined && typeof payload.description !== "string") {
    errors.push("description must be a string");
  }
  if (payload.coverImage !== undefined && typeof payload.coverImage !== "string") {
    errors.push("coverImage must be a string");
  }
  if (
    payload.price !== undefined &&
    (typeof payload.price !== "number" || Number.isNaN(payload.price) || payload.price < 0)
  ) {
    errors.push("price must be a positive number");
  }
  if (
    payload.category !== undefined &&
    !CATEGORIES.includes(payload.category)
  ) {
    errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
  }
  if (
    payload.inStock !== undefined &&
    typeof payload.inStock !== "boolean"
  ) {
    errors.push("inStock must be a boolean");
  }

  return errors;
}

// ---- Routes ----

// GET /api/books - list with search, filter, sort, pagination
router.get("/", (req, res) => {
  let result = [...books];

  const { search, category, sort, order, page, limit, inStock } = req.query;

  // Filter by category
  if (category) {
    result = result.filter(
      (b) => b.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  // Filter by stock status
  if (inStock !== undefined) {
    const wantInStock = String(inStock).toLowerCase() === "true";
    result = result.filter((b) => b.inStock === wantInStock);
  }

  // Search by title or author
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  // Sort
  const sortField = SORTABLE_FIELDS.includes(sort) ? sort : "id";
  const sortOrder = order === "desc" ? -1 : 1;
  result.sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    if (aVal < bVal) return -1 * sortOrder;
    if (aVal > bVal) return 1 * sortOrder;
    return 0;
  });

  // Pagination
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const total = result.length;
  const totalPages = Math.max(Math.ceil(total / limitNum), 1);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = result.slice(startIndex, startIndex + limitNum);

  res.json({
    data: paginated,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  });
});

// GET /api/books/:id - single book
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = books.find((b) => b.id === id);
  if (!book) {
    throw new NotFoundError(`Book with id ${req.params.id} not found`);
  }
  res.json({ data: book });
});

// POST /api/books - create
router.post("/", (req, res) => {
  const errors = validateBookPayload(req.body);
  if (errors.length > 0) {
    throw new ValidationError("Invalid book payload", errors);
  }

  const newBook = {
    id: getNextId(),
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description,
    coverImage:
      req.body.coverImage || `https://picsum.photos/200/300?random=${Date.now()}`,
    inStock: req.body.inStock !== undefined ? req.body.inStock : true,
    createdAt: new Date().toISOString(),
  };

  books.push(newBook);
  res.status(201).json({ data: newBook });
});

// PUT /api/books/:id - update
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new NotFoundError(`Book with id ${req.params.id} not found`);
  }

  const errors = validateBookPayload(req.body, { partial: true });
  if (errors.length > 0) {
    throw new ValidationError("Invalid book payload", errors);
  }

  books[index] = {
    ...books[index],
    ...req.body,
    id: books[index].id,
    createdAt: books[index].createdAt,
  };

  res.json({ data: books[index] });
});

// DELETE /api/books/:id - delete
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new NotFoundError(`Book with id ${req.params.id} not found`);
  }

  const [deleted] = books.splice(index, 1);
  res.json({ data: deleted, message: "Book deleted successfully" });
});

module.exports = router;
module.exports.CATEGORIES = CATEGORIES;
