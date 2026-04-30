import express from "express";
import { upload } from "../config/cloudinary.js";
import Flat from "../models/flatModel.js";

const router = express.Router();

// The "upload.array('images', 5)" middleware catches up to 5 files sent from the frontend under the field name 'images'
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    // Cloudinary automatically processes the files and attaches the new URLs to req.files
    const imageUrls = req.files.map((file) => file.path);

    // Now you can build your Flat object using the regular req.body data + the Cloudinary URLs
    const newFlat = await Flat.create({
      ...req.body, // address, price, area, etc.
      images: imageUrls,
    });

    res.status(201).json(newFlat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading flat", error: error.message });
  }
});

export default router;
