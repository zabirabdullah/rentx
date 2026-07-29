import express from "express";
import {
  getCompanies,
  getCompanyById,
  createProfile,
  updateProfile,
} from "../controllers/companyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// @route   /api/companies
router.route("/")
  .get(getCompanies) // Public: browse companies
  .post(protect, authorize(["company"]), createProfile); // Private: only company accounts can create a profile

// @route   /api/companies/:id
router.route("/:id")
  .get(getCompanyById) // Public: view specific company
  .put(protect, authorize(["company"]), updateProfile); // Private: only the company owner can edit their profile

export default router;
