const Booking      = require("../models/Booking");
const Car          = require("../models/Car");
const { AppError } = require("../utils/errorHandler");
const asyncHandler = require("../utils/asyncHandler");

// ── GET /api/bookings ─────────────────────────────────────────────────────────
// Admin → all bookings  |  Customer → own bookings only
exports.getBookings = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { customer: req.user._id };

  const bookings = await Booking.find(filter)
    .populate("car",      "make model image pricePerDay category")
    .populate("customer", "name email")
    .sort({ createdAt: -1 });

  // Normalise to the shape the frontend expects
  const data = bookings.map(formatBooking);
  res.json({ success: true, count: data.length, data });
});

// ── GET /api/bookings/:id ─────────────────────────────────────────────────────
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("car",      "make model image pricePerDay category")
    .populate("customer", "name email");

  if (!booking) throw new AppError("Booking not found", 404);

  // Customers can only view their own bookings
  if (
    req.user.role !== "admin" &&
    booking.customer._id.toString() !== req.user._id.toString()
  ) {
    throw new AppError("Not authorised to view this booking", 403);
  }

  res.json({ success: true, data: formatBooking(booking) });
});

// ── POST /api/bookings ────────────────────────────────────────────────────────
exports.createBooking = asyncHandler(async (req, res) => {
  const { carId, startDate, endDate } = req.body;

  if (!carId || !startDate || !endDate) {
    throw new AppError("carId, startDate and endDate are required", 400);
  }

  // Validate dates
  const start = new Date(startDate);
  const end   = new Date(endDate);
  if (isNaN(start) || isNaN(end)) throw new AppError("Invalid date format", 400);
  if (end <= start)               throw new AppError("End date must be after start date", 400);

  // Check car exists and is available
  const car = await Car.findById(carId);
  if (!car)                        throw new AppError("Car not found", 404);
  if (car.status !== "available")  throw new AppError("Car is not available", 400);

  // Check no overlapping active bookings for this car
  const overlap = await Booking.findOne({
    car: carId,
    status: "active",
    $or: [
      { startDate: { $lt: end   }, endDate: { $gt: start } },
    ],
  });
  if (overlap) throw new AppError("Car is already booked for those dates", 400);

  // Calculate price
  const days       = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalPrice = days * car.pricePerDay;

  // Create booking and mark car as rented — atomically with Promise.all
  const [booking] = await Promise.all([
    Booking.create({
      car:          carId,
      customer:     req.user._id,
      customerName: req.user.name,
      startDate:    start,
      endDate:      end,
      totalPrice,
    }),
    Car.findByIdAndUpdate(carId, { status: "rented" }),
  ]);

  const populated = await booking.populate([
    { path: "car",      select: "make model image pricePerDay category" },
    { path: "customer", select: "name email" },
  ]);

  res.status(201).json({ success: true, data: formatBooking(populated) });
});

// ── PATCH /api/bookings/:id/status  (admin only) ──────────────────────────────
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["active", "completed", "cancelled"].includes(status)) {
    throw new AppError("Invalid status value", 400);
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError("Booking not found", 404);

  const prevStatus = booking.status;
  booking.status   = status;
  await booking.save();

  // When completing or cancelling, free up the car
  if (prevStatus === "active" && (status === "completed" || status === "cancelled")) {
    await Car.findByIdAndUpdate(booking.car, { status: "available" });
  }

  res.json({ success: true, data: formatBooking(booking) });
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatBooking(b) {
  const obj = b.toObject ? b.toObject() : b;
  return {
    ...obj,
    _id:          obj._id?.toString(),
    carId:        obj.car?._id?.toString() ?? obj.car?.toString(),
    customerId:   obj.customer?._id?.toString() ?? obj.customer?.toString(),
    customerName: obj.customerName,
    startDate:    obj.startDate instanceof Date
      ? obj.startDate.toISOString().split("T")[0]
      : obj.startDate,
    endDate:      obj.endDate instanceof Date
      ? obj.endDate.toISOString().split("T")[0]
      : obj.endDate,
  };
}
