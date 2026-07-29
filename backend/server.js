import express from "express";
import cors from "cors";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies and allow cross-origin requests
app.use(express.json());
app.use(cors());

// Basic test route
app.get("/", (req, res) => {
  res.send("Rentx API is running...");
});

// Mount the API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/companies", companyRoutes);

// Central error handler — must be after all routes
app.use(errorHandler);

// Start the server
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
