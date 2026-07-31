import express from "express";
import cors from "cors";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import rentalRequestRoutes from "./routes/rentalRequestRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

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
app.use("/api/upload", uploadRoutes);
app.use("/api/rental-requests", rentalRequestRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/notifications", notificationRoutes);

// Central error handler — must be after all routes
app.use(errorHandler);

// Start the server
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
