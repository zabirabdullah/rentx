import express from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// @route   /api/properties
router.route("/")
  .get(getProperties) // Public: anyone can browse listings
  .post(protect, authorize(["owner"]), createProperty); // Private: only owners can list properties

// @route   /api/properties/:id
router.route("/:id")
  .get(getPropertyById) // Public: anyone can view a specific property
  .put(protect, authorize(["owner"]), updateProperty) // Private: Owner only
  .delete(protect, authorize(["owner", "admin"]), deleteProperty); // Private: Owner or Admin

export default router;
