import express from "express";
import { createRequest, getMyRequests, updateRequestStatus } from "../controllers/serviceRequestController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.post("/", protect, authorize(["tenant", "owner"]), createRequest);
router.get("/my", protect, authorize(["tenant", "owner", "company", "admin"]), getMyRequests);
router.put("/:id", protect, authorize(["tenant", "owner", "company", "admin"]), updateRequestStatus);

export default router;
