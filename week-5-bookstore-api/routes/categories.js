const express = require("express");
const router = express.Router();
const { books } = require("../data/books");
const { CATEGORIES } = require("./books");

// GET /api/categories - list all categories with book counts
router.get("/", (req, res) => {
  const data = CATEGORIES.map((name) => ({
    name,
    count: books.filter((b) => b.category === name).length,
  }));
  res.json({ data });
});

module.exports = router;
