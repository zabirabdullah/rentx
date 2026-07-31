import express from "express";
import {
  createRequest,
  getMyRequests,
  updateRequestStatus,
} from "../controllers/rentalRequestController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// @route   POST /api/rental-requests
router.post("/", protect, createRequest);

// @route   GET /api/rental-requests/my
router.get("/my", protect, authorize(["tenant", "owner", "admin"]), getMyRequests);

// @route   PUT /api/rental-requests/:id
router.put("/:id", protect, authorize(["tenant", "owner", "admin"]), updateRequestStatus);

export default router;
