// Not found middleware
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
};

// Global error handler
const errorHandler = (error, req, res, next) => {
  let statusCode = error.status || error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  // Handle specific error types
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (error.code === "SQLITE_CONSTRAINT") {
    statusCode = 400;
    message = "Database constraint violation";
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      error: error,
    }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
