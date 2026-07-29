import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { syncUser } from "../controllers/authController.js";

const router = express.Router();

// The frontend calls this endpoint with the Bearer token
router.post("/sync", protect, syncUser);

export default router;
