import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Sync Firebase user with MongoDB (create if doesn't exist)
// @route   POST /api/auth/sync
// @access  Private (Requires valid Firebase Token)
const syncUser = asyncHandler(async (req, res) => {
  // uid and email come directly from the verified Firebase token
  const { uid, email } = req.firebaseUser;
  const { name, phone, address, role } = req.body;

  let user = await User.findOne({ firebaseUid: uid });

  // If user doesn't exist in Mongo, create them
  if (!user) {
    if (!name || !phone || !address || !role) {
      res.status(400);
      throw new Error("Name, phone, address, and role are required for first-time registration");
    }

    // Validate Bangladeshi phone number (11 digits starting with 01)
    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400);
      throw new Error("Please provide a valid 11-digit Bangladeshi phone number starting with 01");
    }

    // Prevent malicious users from registering as admin or invalid roles
    const allowedRoles = ["tenant", "owner", "company"];
    if (!allowedRoles.includes(role)) {
      res.status(400);
      throw new Error("Invalid role selected");
    }

    user = await User.create({
      firebaseUid: uid,
      name,
      email,
      phone,
      address,
      role,
    });
  }

  // Respond with the MongoDB user profile
  res.status(200).json(user);
});

export { syncUser };
