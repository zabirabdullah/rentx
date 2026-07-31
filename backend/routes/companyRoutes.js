import express from "express";
import {
  getCompanies,
  getCompanyById,
  getMyProfile,
  createProfile,
  updateProfile,
  deleteCompanyProfile,
} from "../controllers/companyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// @route   /api/companies
router.route("/")
  .get(getCompanies) // Public: browse companies
  .post(protect, authorize(["company"]), createProfile); // Private: only company accounts can create a profile

// @route   /api/companies/my
router.route("/my").get(protect, authorize(["company"]), getMyProfile);

// @route   /api/companies/:id
router.route("/:id")
  .get(getCompanyById) // Public: view specific company
  .put(protect, authorize(["company"]), updateProfile) // Private: only the company owner can edit their profile
  .delete(protect, authorize(["admin"]), deleteCompanyProfile); // Private: admin only

export default router;
