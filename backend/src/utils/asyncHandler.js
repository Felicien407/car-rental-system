/**
 * Wraps an async route handler so we never need try/catch in every controller.
 * Caught errors are forwarded to Express's global error middleware.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
