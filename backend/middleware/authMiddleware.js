import { auth } from "../config/firebase.js";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token with Firebase Admin
      const decodedToken = await auth.verifyIdToken(token);

      // Attach Firebase data just in case we need it
      req.firebaseUser = decodedToken;

      // Try to find the user in our MongoDB database
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      // We don't error out here if user is not found, because the `/api/auth/sync` 
      // endpoint needs to pass through this middleware when the user is created for the first time.
      if (user) {
        req.user = user;
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const protectOptional = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decodedToken = await auth.verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      if (user) req.user = user;
    } catch (error) {
      // Do nothing, just proceed as an unauthenticated request
    }
  }
  next();
};

export { protect, protectOptional };
