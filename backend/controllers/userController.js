import User from "../models/userModel.js";
import CompanyProfile from "../models/companyProfileModel.js";
import Property from "../models/propertyModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { auth } from "../config/firebase.js";

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
    user.address = req.body.address || user.address;

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

// @desc    Delete a user (and their Firebase account + related data)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const userToDelete = await User.findById(req.params.id);

  if (!userToDelete) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent admin from deleting themselves
  if (userToDelete._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own admin account");
  }

  // Clean up related data based on role
  if (userToDelete.role === "owner") {
    await Property.deleteMany({ ownerId: userToDelete._id });
  }
  if (userToDelete.role === "company") {
    await CompanyProfile.deleteMany({ userId: userToDelete._id });
  }

  // Delete from Firebase Auth
  if (userToDelete.firebaseUid) {
    try {
      await auth.deleteUser(userToDelete.firebaseUid);
    } catch (e) {
      console.error("Firebase user deletion failed (may already be deleted):", e.message);
    }
  }

  // Delete from MongoDB
  await User.findByIdAndDelete(req.params.id);

  res.json({ message: "User and associated data deleted successfully" });
});

export { getUsers, getUserById, updateUser, deleteUser };
