export function createError(message, status = 500) {
  const err = new Error(message);
  err.status = status;
  err.success = false;
  return err;
}

// default error handler
export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const response = {
    status,
    message: err.message || "There was an error!",
    success: err.success || false,
  };

  if (process.env.NODE_ENV == "development") {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}
