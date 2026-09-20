const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const booksRouter = require("./routes/books");
const categoriesRouter = require("./routes/categories");
const authorsRouter = require("./routes/authors");

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Global middleware ----

// CORS - configure allowed origins via env var (comma-separated), default to allow all in dev
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : "*";

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());
app.use(logger);

// ---- Routes ----

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/books", booksRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/authors", authorsRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Bookstore API is running",
    docs: "/api/health, /api/books, /api/categories, /api/authors",
  });
});

// ---- Error handling (must be last) ----
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Bookstore API listening on port ${PORT}`);
});

module.exports = app;
