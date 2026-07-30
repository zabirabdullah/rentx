import express from "express";
import { createReport, getReports, updateReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.post("/", protect, createReport);
router.get("/", protect, authorize(["admin"]), getReports);
router.put("/:id", protect, authorize(["admin"]), updateReport);

export default router;
