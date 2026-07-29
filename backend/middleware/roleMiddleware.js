const authorize = (roles) => {
  return (req, res, next) => {
    // Make sure the user is attached (authMiddleware succeeded)
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found in DB" });
    }

    // Check if the user's role is in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role '${req.user.role}' is not authorized to access this route` });
    }

    next();
  };
};

export { authorize };
