// Standardized API response helpers
class ResponseHelper {
  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(res, message = "Error", statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
    });
  }

  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  static badRequest(res, message = "Bad request", errors = null) {
    return this.error(res, message, 400, errors);
  }

  static created(res, data, message = "Created successfully") {
    return this.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ResponseHelper;
