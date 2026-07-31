import User from "../models/userModel.js";
import CompanyProfile from "../models/companyProfileModel.js";
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

  // If user doesn't exist in Mongo
  if (!user) {
    // If registration details are NOT provided (e.g. auto-sync check on auth change during registration),
    // do NOT delete the Firebase user! Just return 404 so caller knows profile is pending creation.
    if (!name || !phone || !address || !role) {
      res.status(404);
      throw new Error("User profile not found in database. Registration incomplete.");
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

      // If user registered as a company, auto-initialize their CompanyProfile
      if (role === "company") {
        await CompanyProfile.create({
          userId: user._id,
          businessName: name,
          servicesOffered: ["moving", "cleaning"],
          baseRates: {},
          description: ""
        });
      }
    } catch (error) {
      console.error("User creation error:", error);
      await rollbackFirebaseUser();
      res.status(400);
      const msg = error.code === 11000 
        ? "An account with this email already exists in our database."
        : (error.message || "Failed to create user profile.");
      throw new Error(msg);
    }
  }

  // Respond with the MongoDB user profile
  res.status(200).json(user);
});

export { syncUser };
