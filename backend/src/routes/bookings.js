const express = require("express");
const router  = express.Router();
const {
  getBookings, getBooking, createBooking, updateBookingStatus,
} = require("../controllers/bookingController");
const { protect, restrictTo } = require("../middleware/auth");

// All booking routes require authentication
router.use(protect);

// GET  /api/bookings  — admin: all | customer: own
router.get("/", getBookings);

// GET  /api/bookings/:id
router.get("/:id", getBooking);

// POST /api/bookings  — customers create bookings
router.post("/", createBooking);

// PATCH /api/bookings/:id/status  — admin only
router.patch("/:id/status", restrictTo("admin"), updateBookingStatus);

module.exports = router;
