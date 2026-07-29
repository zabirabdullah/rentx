import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Self or Admin)
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Check if the requester is the owner of the profile or an admin
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view this profile");
    }
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (Self or Admin)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Check if the requester is the owner of the profile or an admin
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to update this profile");
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    
    // Only admins can change a user's role
    if (req.user.role === "admin" && req.body.role) {
      user.role = req.body.role;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { getUsers, getUserById, updateUser };
