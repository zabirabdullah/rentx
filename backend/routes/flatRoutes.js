import express from "express";
import mongoose from "mongoose";
import Flat from "../models/flatModel.js";
import User from "../models/userModel.js";

const router = express.Router();

const fallbackImage =
  "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&q=80";

router.get("/", async (req, res) => {
  try {
    const flats = await Flat.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      {
        $match: {
          "ownerData.role": { $in: ["owner", "admin"] },
        },
      },
      {
        $unwind: "$ownerData",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          ownerId: 1,
          address: 1,
          name: 1,
          number: 1,
          holdingNo: 1,
          type: 1,
          area: 1,
          price: 1,
          service: 1,
          bedroom: 1,
          bathroom: 1,
          balcony: 1,
          storey: 1,
          position: 1,
          images: 1,
          description: 1,
          isAvailable: 1,
          createdAt: 1,
          updatedAt: 1,
          "ownerData._id": 1,
          "ownerData.name": 1,
          "ownerData.email": 1,
          "ownerData.phone": 1,
          "ownerData.role": 1,
        },
      },
    ]);

    // Transform the data to match the expected format
    const formattedFlats = flats.map((flat) => ({
      ...flat,
      ownerId: flat.ownerData,
    }));

    res.json(formattedFlats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching flats", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const flat = await Flat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      {
        $match: {
          "ownerData.role": { $in: ["owner", "admin"] },
        },
      },
      {
        $unwind: "$ownerData",
      },
      {
        $project: {
          _id: 1,
          ownerId: 1,
          address: 1,
          name: 1,
          number: 1,
          holdingNo: 1,
          type: 1,
          area: 1,
          price: 1,
          service: 1,
          bedroom: 1,
          bathroom: 1,
          balcony: 1,
          storey: 1,
          position: 1,
          images: 1,
          description: 1,
          isAvailable: 1,
          createdAt: 1,
          updatedAt: 1,
          "ownerData._id": 1,
          "ownerData.name": 1,
          "ownerData.email": 1,
          "ownerData.phone": 1,
          "ownerData.role": 1,
        },
      },
    ]);

    if (!flat || flat.length === 0) {
      return res.status(404).json({ message: "Flat not found" });
    }

    // Transform the data to match the expected format
    const result = {
      ...flat[0],
      ownerId: flat[0].ownerData,
    };

    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching flat", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    // Validate all required fields
    const requiredFields = [
      "ownerId",
      "address",
      "name",
      "holdingNo",
      "type",
      "area",
      "price",
      "service",
      "storey",
      "position",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const ownerId = req.body.ownerId;

    if (!mongoose.isValidObjectId(ownerId)) {
      return res.status(400).json({ message: "Invalid owner id" });
    }

    const owner = await User.findById(ownerId);
    if (!owner) {
      return res
        .status(400)
        .json({ message: "Owner not found. Please register the owner first." });
    }

    // Check if the user has owner role
    if (owner.role !== "owner" && owner.role !== "admin") {
      return res.status(403).json({
        message:
          "Only users with owner role can create flats. Tenant users cannot create flats.",
      });
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
      isAvailable:
        req.body.isAvailable !== "false" && req.body.isAvailable !== false,
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
    // Get the current flat to check its owner
    const currentFlat = await Flat.findById(req.params.id);
    if (!currentFlat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    // Determine which owner to check (new owner if provided, otherwise current owner)
    const ownerIdToCheck = req.body.ownerId || currentFlat.ownerId;

    if (!mongoose.isValidObjectId(ownerIdToCheck)) {
      return res.status(400).json({ message: "Invalid owner id" });
    }

    const owner = await User.findById(ownerIdToCheck);
    if (!owner) {
      return res.status(400).json({
        message: "Owner not found. Please register the owner first.",
      });
    }

    // Check if the owner has owner role
    if (owner.role !== "owner" && owner.role !== "admin") {
      return res.status(403).json({
        message:
          "Only users with owner role can update flats. Tenant users cannot update flats.",
      });
    }

    const updateData = {
      ...req.body,
      area: req.body.area !== undefined ? Number(req.body.area) : undefined,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      service:
        req.body.service !== undefined ? Number(req.body.service) : undefined,
      bedroom:
        req.body.bedroom !== undefined ? Number(req.body.bedroom) : undefined,
      bathroom:
        req.body.bathroom !== undefined ? Number(req.body.bathroom) : undefined,
      balcony:
        req.body.balcony !== undefined ? Number(req.body.balcony) : undefined,
      storey:
        req.body.storey !== undefined ? Number(req.body.storey) : undefined,
      isAvailable:
        req.body.isAvailable !== undefined
          ? req.body.isAvailable !== "false" && req.body.isAvailable !== false
          : undefined,
    };

    const sanitizedUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined),
    );

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
    res
      .status(500)
      .json({ message: "Error updating flat", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    // Check if the owner has owner role
    const owner = await User.findById(flat.ownerId);
    if (!owner) {
      return res.status(400).json({
        message: "Owner not found. Cannot delete flat.",
      });
    }

    if (owner.role !== "owner" && owner.role !== "admin") {
      return res.status(403).json({
        message:
          "Only users with owner role can delete flats. Tenant users cannot delete flats.",
      });
    }

    const deletedFlat = await Flat.findByIdAndDelete(req.params.id);

    res.json({ message: "Flat deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting flat", error: error.message });
  }
});

export default router;
