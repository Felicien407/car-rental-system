const User         = require("../models/User");
const { signToken }  = require("../utils/jwt");
const { AppError }   = require("../utils/errorHandler");
const asyncHandler   = require("../utils/asyncHandler");

// ── Helpers ───────────────────────────────────────────────────────────────────
const sendAuth = (res, statusCode, user) => {
  const token = signToken({ id: user._id, role: user.role });
  const { password, ...userData } = user.toObject();
  res.status(statusCode).json({ success: true, token, user: userData });
};

// ── POST /api/auth/register ───────────────────────────────────────────────────
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Please provide name, email and password", 400);
  }

  const exists = await User.findOne({ email });
  if (exists) throw new AppError("Email already exists", 400);

  const user = await User.create({ name, email, password }); // role defaults to "customer"
  sendAuth(res, 201, user);
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError("Invalid credentials", 401);
  }

  sendAuth(res, 200, user);
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
