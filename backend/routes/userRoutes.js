import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// @desc    Fetch all users
// @route   GET /api/users
// @access  Private/Admin
router.route("/").get(protect, authorize(["admin"]), getUsers);

// @desc    Fetch & Update a specific user by ID
// @route   GET, PUT /api/users/:id
// @access  Private (Self or Admin)
router.route("/:id")
  .get(protect, getUserById)
  .put(protect, updateUser);

export default router;
