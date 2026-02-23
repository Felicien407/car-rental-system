const express = require("express");
const router  = express.Router();
const {
  getCars, getCar, createCar, updateCar, deleteCar, getStats,
} = require("../controllers/carController");
const { protect, restrictTo } = require("../middleware/auth");

// GET /api/cars/stats  — must come before /:id so it isn't treated as an id
router.get("/stats", protect, restrictTo("admin"), getStats);

// GET /api/cars
router.get("/", getCars); // public — customers and guests can browse

// GET /api/cars/:id
router.get("/:id", getCar);

// POST /api/cars  — admin only
router.post("/", protect, restrictTo("admin"), createCar);

// PUT /api/cars/:id  — admin only
router.put("/:id", protect, restrictTo("admin"), updateCar);

// DELETE /api/cars/:id  — admin only
router.delete("/:id", protect, restrictTo("admin"), deleteCar);

module.exports = router;
