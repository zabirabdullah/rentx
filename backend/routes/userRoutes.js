import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// @desc    Fetch all users
// @route   GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Create a new user
// @route   POST /api/users
router.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
