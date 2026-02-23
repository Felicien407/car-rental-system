const User        = require("../models/User");
const { verifyToken } = require("../utils/jwt");
const { AppError }    = require("../utils/errorHandler");
const asyncHandler    = require("../utils/asyncHandler");

// ── protect ───────────────────────────────────────────────────────────────────
// Verifies the JWT and attaches req.user for downstream handlers.
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Not authorised — no token provided", 401);
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token); // throws JsonWebTokenError / TokenExpiredError

  const user = await User.findById(decoded.id).select("-password");
  if (!user) throw new AppError("User no longer exists", 401);

  req.user = user;
  next();
});

// ── restrictTo ────────────────────────────────────────────────────────────────
// Usage:  router.delete("/", protect, restrictTo("admin"), handler)
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }
  next();
};

module.exports = { protect, restrictTo };
