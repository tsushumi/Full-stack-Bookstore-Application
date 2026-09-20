const express = require("express");
const router = express.Router();
const { books } = require("../data/books");
const { NotFoundError } = require("../middleware/errorHandler");

// Helper: build a slug id for an author name, e.g. "Ngugi wa Thiong'o" -> "ngugi-wa-thiongo"
function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getAuthorsList() {
  const map = new Map();
  for (const book of books) {
    const slug = slugify(book.author);
    if (!map.has(slug)) {
      map.set(slug, { id: slug, name: book.author, bookCount: 0 });
    }
    map.get(slug).bookCount += 1;
  }
  return Array.from(map.values());
}

// GET /api/authors - list all authors
router.get("/", (req, res) => {
  res.json({ data: getAuthorsList() });
});

// GET /api/authors/:id/books - all books by a given author
router.get("/:id/books", (req, res) => {
  const authorBooks = books.filter((b) => slugify(b.author) === req.params.id);
  if (authorBooks.length === 0) {
    throw new NotFoundError(`Author with id ${req.params.id} not found`);
  }
  res.json({
    data: {
      author: authorBooks[0].author,
      books: authorBooks,
    },
  });
});

module.exports = router;
