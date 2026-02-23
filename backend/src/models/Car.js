const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, "Make is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1990, "Year must be 1990 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Sedan", "SUV", "Sports", "Electric", "Truck", "Van"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [1, "Price must be greater than 0"],
    },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance"],
      default: "available",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    mileage: {
      type: Number,
      default: 0,
      min: 0,
    },
    seats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: 1,
    },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      default: "Automatic",
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
    },
  },
  { timestamps: true }
);

// ── Text index for search ──────────────────────────────────────────────────────
carSchema.index({ make: "text", model: "text" });

module.exports = mongoose.model("Car", carSchema);
