import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import { auth } from "../config/firebase.js";

// @desc    Sync Firebase user with MongoDB (create if doesn't exist)
// @route   POST /api/auth/sync
// @access  Private (Requires valid Firebase Token)
const syncUser = asyncHandler(async (req, res) => {
  // uid and email come directly from the verified Firebase token
  const { uid, email } = req.firebaseUser;
  const { name, phone, address, role } = req.body;

  let user = await User.findOne({ firebaseUid: uid });

  const rollbackFirebaseUser = async () => {
    try {
      await auth.deleteUser(uid);
    } catch (e) {
      console.error("Error rolling back Firebase user:", e.message);
    }
  };

  // If user doesn't exist in Mongo, create them
  if (!user) {
    // If they are missing fields, they either sent a bad registration request OR they are trying 
    // to log in to a "ghost" Firebase account that never finished syncing to MongoDB.
    if (!name || !phone || !address || !role) {
      await rollbackFirebaseUser();
      res.status(400);
      throw new Error("Incomplete registration detected. Your account has been reset. Please register again.");
    }

    // Validate Bangladeshi phone number (11 digits starting with 01)
    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(phone)) {
      await rollbackFirebaseUser();
      res.status(400);
      throw new Error("Please provide a valid 11-digit Bangladeshi phone number starting with 01.");
    }

    // Prevent malicious users from registering as admin or invalid roles
    const allowedRoles = ["tenant", "owner", "company"];
    if (!allowedRoles.includes(role)) {
      await rollbackFirebaseUser();
      res.status(400);
      throw new Error("Invalid role selected");
    }

    try {
      user = await User.create({
        firebaseUid: uid,
        name,
        email,
        phone,
        address,
        role,
      });
    } catch (error) {
      await rollbackFirebaseUser();
      res.status(400);
      throw new Error("Failed to create user in database. Account reset.");
    }
  }

  // Respond with the MongoDB user profile
  res.status(200).json(user);
});

export { syncUser };
