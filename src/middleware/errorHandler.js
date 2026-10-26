export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const response = {
    error: {
      message: error.message || "Error interno del servidor"
    }
  };

  if (error.details) {
    response.error.details = error.details;
  }

  return res.status(status).json(response);
}
