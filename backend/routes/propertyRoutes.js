import express from "express";
import {
  getProperties,
  getPropertyMap,
  searchPropertiesByLocation,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import { protect, protectOptional } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// @route   /api/properties
router.route("/")
  .get(getProperties) // Public: anyone can browse listings
  .post(protect, authorize(["owner"]), createProperty); // Private: only owners can list properties

// @route   /api/properties/map
router.get("/map", getPropertyMap); // Public: map-friendly property feed

// @route   /api/properties/search/location
router.get("/search/location", searchPropertiesByLocation); // Public: location-specific search

// @route   /api/properties/:id
router.route("/:id")
  .get(protectOptional, getPropertyById) // Public: but identifies user to check if they can see unavailable properties
  .put(protect, authorize(["owner"]), updateProperty) // Private: Owner only
  .delete(protect, authorize(["owner", "admin"]), deleteProperty); // Private: Owner or Admin

export default router;
