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
    // 1. Update this line to pull all 5 fields from the Postman request
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Update this line to pass all 5 fields to MongoDB
    const user = await User.create({ name, email, password, phone, role });
    res.status(201).json(user);
  } catch (error) {
    // Pro-tip: Send error.message instead of 'Server Error' so you can see exactly why it failed!
    res.status(500).json({ message: error.message });
  }
});

export default router;
