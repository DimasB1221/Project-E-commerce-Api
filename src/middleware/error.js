/**
 * errorHandler
 * -----------------
 * Middleware global untuk menangkap error.
 * - Ambil status dari error (default 500)
 * - Return response JSON dengan pesan error
 */
export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};
