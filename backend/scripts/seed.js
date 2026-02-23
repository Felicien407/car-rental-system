/**
 * Seed script — populates MongoDB with demo users, cars, and bookings.
 * Run once with:  npm run seed
 * To wipe and reseed: it clears existing data first.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const connectDB = require("../src/config/db");
const User    = require("../src/models/User");
const Car     = require("../src/models/Car");
const Booking = require("../src/models/Booking");

// ── Seed Data ──────────────────────────────────────────────────────────────────
const users = [
  { name: "Admin User",    email: "admin@rentacar.com", password: "admin123",  role: "admin"    },
  { name: "Alice Johnson", email: "alice@example.com",  password: "alice123",  role: "customer" },
  { name: "Bob Smith",     email: "bob@example.com",    password: "bob123",    role: "customer" },
];

const cars = [
  {
    make: "Tesla", model: "Model S", year: 2023, category: "Electric",
    pricePerDay: 120, status: "available", rating: 4.8, mileage: 12000,
    seats: 5, transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80",
  },
  {
    make: "Lamborghini", model: "Huracán", year: 2022, category: "Sports",
    pricePerDay: 450, status: "available", rating: 4.9, mileage: 5000,
    seats: 2, transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
  },
  {
    make: "BMW", model: "X5", year: 2023, category: "SUV",
    pricePerDay: 150, status: "available", rating: 4.7, mileage: 18000,
    seats: 7, transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
  },
  {
    make: "Mercedes", model: "C-Class", year: 2022, category: "Sedan",
    pricePerDay: 130, status: "available", rating: 4.6, mileage: 22000,
    seats: 5, transmission: "Automatic",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
  },
  {
    make: "Porsche", model: "911", year: 2023, category: "Sports",
    pricePerDay: 380, status: "available", rating: 5.0, mileage: 3000,
    seats: 4, transmission: "Manual",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  },
  {
    make: "Ford", model: "Mustang", year: 2022, category: "Sports",
    pricePerDay: 110, status: "maintenance", rating: 4.5, mileage: 30000,
    seats: 4, transmission: "Manual",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e8e9b0e8?w=600&q=80",
  },
];

// ── Run ────────────────────────────────────────────────────────────────────────
const seed = async () => {
  await connectDB();
  console.log("🌱  Seeding database…");

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Car.deleteMany(),
    Booking.deleteMany(),
  ]);
  console.log("🗑   Cleared existing data");

  // Create users (passwords will be hashed by pre-save hook)
  const createdUsers = await User.insertMany(
    await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    ),
    { lean: true }
  );

  // We need to bypass the pre-save hook since insertMany doesn't trigger it,
  // so we hash manually above and skip the hook by using insertMany.
  // (alternatively use create() one by one to trigger the hook)
  console.log(`👤  Created ${createdUsers.length} users`);

  // Create cars
  const createdCars = await Car.insertMany(cars);
  console.log(`🚗  Created ${createdCars.length} cars`);

  // Create sample bookings (Alice books the BMW X5)
  const alice = createdUsers.find((u) => u.email === "alice@example.com");
  const bob   = createdUsers.find((u) => u.email === "bob@example.com");
  const bmw   = createdCars.find((c) => c.model === "X5");
  const tesla = createdCars.find((c) => c.model === "Model S");

  const bookings = [
    {
      car:          bmw._id,
      customer:     alice._id,
      customerName: alice.name,
      startDate:    new Date("2025-02-10"),
      endDate:      new Date("2025-02-15"),
      totalPrice:   750,
      status:       "active",
    },
    {
      car:          tesla._id,
      customer:     bob._id,
      customerName: bob.name,
      startDate:    new Date("2025-01-20"),
      endDate:      new Date("2025-01-25"),
      totalPrice:   600,
      status:       "completed",
    },
  ];

  await Booking.insertMany(bookings);
  console.log(`📋  Created ${bookings.length} bookings`);

  // Mark BMW as rented (matches active booking)
  await Car.findByIdAndUpdate(bmw._id, { status: "rented" });

  console.log("\n✅  Seed complete!");
  console.log("───────────────────────────────────────");
  console.log("Login credentials:");
  console.log("  Admin    → admin@rentacar.com  / admin123");
  console.log("  Customer → alice@example.com   / alice123");
  console.log("  Customer → bob@example.com     / bob123");
  console.log("───────────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
