import express from "express";
import mongoose from "mongoose";
import Flat from "../models/flatModel.js";
import User from "../models/userModel.js";

const router = express.Router();

const fallbackImage =
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80";

router.get("/", async (req, res) => {
  try {
    const flats = await Flat.find({})
      .populate("ownerId", "name email phone role")
      .sort({ createdAt: -1 });

    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flats", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id).populate(
      "ownerId",
      "name email phone role",
    );

    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flat", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const ownerId = req.body.ownerId;
    if (!ownerId) {
      return res.status(400).json({ message: "Owner is required and must be a registered user" });
    }

    if (!mongoose.isValidObjectId(ownerId)) {
      return res.status(400).json({ message: "Invalid owner id" });
    }

    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(400).json({ message: "Owner not found. Please register the owner first." });
    }
    const newFlat = await Flat.create({
      ...req.body,
      area: Number(req.body.area),
      price: Number(req.body.price),
      service: Number(req.body.service),
      bedroom: Number(req.body.bedroom ?? 1),
      bathroom: Number(req.body.bathroom ?? 1),
      balcony: Number(req.body.balcony ?? 0),
      storey: Number(req.body.storey),
      images: [fallbackImage],
      isAvailable: req.body.isAvailable !== "false" && req.body.isAvailable !== false,
    });

    res.status(201).json(newFlat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating flat", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      area: req.body.area !== undefined ? Number(req.body.area) : undefined,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      service: req.body.service !== undefined ? Number(req.body.service) : undefined,
      bedroom: req.body.bedroom !== undefined ? Number(req.body.bedroom) : undefined,
      bathroom: req.body.bathroom !== undefined ? Number(req.body.bathroom) : undefined,
      balcony: req.body.balcony !== undefined ? Number(req.body.balcony) : undefined,
      storey: req.body.storey !== undefined ? Number(req.body.storey) : undefined,
      isAvailable:
        req.body.isAvailable !== undefined
          ? req.body.isAvailable !== "false" && req.body.isAvailable !== false
          : undefined,
    };

    const sanitizedUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined),
    );

    // If ownerId is present in update, ensure the owner exists
    if (sanitizedUpdateData.ownerId) {
      if (!mongoose.isValidObjectId(sanitizedUpdateData.ownerId)) {
        return res.status(400).json({ message: "Invalid owner id" });
      }

      const ownerExists = await User.findById(sanitizedUpdateData.ownerId);
      if (!ownerExists) {
        return res.status(400).json({ message: "Owner not found. Please register the owner first." });
      }
    }

    const updatedFlat = await Flat.findByIdAndUpdate(
      req.params.id,
      sanitizedUpdateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedFlat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    res.json(updatedFlat);
  } catch (error) {
    res.status(500).json({ message: "Error updating flat", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedFlat = await Flat.findByIdAndDelete(req.params.id);

    if (!deletedFlat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    res.json({ message: "Flat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting flat", error: error.message });
  }
});

export default router;
