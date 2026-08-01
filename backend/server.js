import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
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

// Security Headers with Helmet
app.use(helmet());

// CORS Restrictions
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Access Denied"));
    },
    credentials: true,
  })
);

// Rate Limiting Protection against Brute-force & DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again after 15 minutes." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 auth requests per windowMs to prevent brute-force attacks
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login/auth attempts, please try again after 15 minutes." },
});

// Apply rate limiters
app.use("/api/", apiLimiter);
app.use("/api/auth", authLimiter);

// Middleware to parse JSON bodies (with size limits to prevent payload abuse)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// NoSQL Query Injection Sanitization
app.use(mongoSanitize());

// Basic test route
app.get("/", (req, res) => {
  res.send("RentX API is running securely...");
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
