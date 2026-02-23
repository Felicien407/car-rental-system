const Car          = require("../models/Car");
const Booking      = require("../models/Booking");
const { AppError } = require("../utils/errorHandler");
const asyncHandler = require("../utils/asyncHandler");

// ── GET /api/cars ─────────────────────────────────────────────────────────────
// Query params: category, status, search
exports.getCars = asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;
  const filter = {};

  if (category && category !== "All") filter.category = category;
  if (status   && status   !== "All") filter.status   = status;
  if (search) {
    filter.$or = [
      { make:  { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
    ];
  }

  const cars = await Car.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: cars.length, data: cars });
});

// ── GET /api/cars/:id ─────────────────────────────────────────────────────────
exports.getCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new AppError("Car not found", 404);
  res.json({ success: true, data: car });
});

// ── POST /api/cars  (admin only) ──────────────────────────────────────────────
exports.createCar = asyncHandler(async (req, res) => {
  const car = await Car.create(req.body);
  res.status(201).json({ success: true, data: car });
});

// ── PUT /api/cars/:id  (admin only) ───────────────────────────────────────────
exports.updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!car) throw new AppError("Car not found", 404);
  res.json({ success: true, data: car });
});

// ── DELETE /api/cars/:id  (admin only) ────────────────────────────────────────
exports.deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) throw new AppError("Car not found", 404);

  // Prevent deletion if car has active bookings
  const activeBooking = await Booking.findOne({ car: req.params.id, status: "active" });
  if (activeBooking) {
    throw new AppError("Cannot delete a car with an active booking", 400);
  }

  await car.deleteOne();
  res.json({ success: true, message: "Car deleted successfully" });
});

// ── GET /api/cars/stats  (admin only) ─────────────────────────────────────────
exports.getStats = asyncHandler(async (req, res) => {
  const [totalCars, available, rented, totalBookings] = await Promise.all([
    Car.countDocuments(),
    Car.countDocuments({ status: "available" }),
    Car.countDocuments({ status: "rented" }),
    Booking.countDocuments(),
  ]);

  res.json({ success: true, data: { totalCars, available, rented, totalBookings } });
});
