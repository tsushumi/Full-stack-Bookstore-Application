// Centralized error handling

class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApiError";
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

class ValidationError extends ApiError {
  constructor(message = "Validation failed", details = null) {
    super(400, message, details);
    this.name = "ValidationError";
  }
}

// 404 handler for unmatched routes
function notFoundHandler(req, res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}

// Global error handler - must be registered last, after all routes
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} -`, err);
  }

  const body = {
    error: {
      status: statusCode,
      message,
    },
  };

  if (err.details) {
    body.error.details = err.details;
  }

  res.status(statusCode).json(body);
}

module.exports = {
  ApiError,
  NotFoundError,
  ValidationError,
  notFoundHandler,
  errorHandler,
};
