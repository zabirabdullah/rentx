import mongoose from "mongoose";

const furnitureItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  estimatedMassKg: { type: Number, required: true },
  size: { type: String, required: true, enum: ["small", "medium", "large", "oversized"] },
  requiresStairs: { type: Boolean, default: false },
  specialCare: { type: Boolean, default: false },
}, { _id: false });

const serviceRequestSchema = mongoose.Schema(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyProfile", required: true },
    serviceType: { type: String, enum: ["moving", "cleaning", "electrician", "plumbing", "painting"], required: true },

    // Moving
    fromAddress: { type: String },
    toAddress: { type: String },
    furnitureItems: [furnitureItemSchema],
    storey: { type: Number },
    elevatorAvailable: { type: Boolean, default: false },

    // Cleaning
    numberOfRooms: { type: Number },
    spaceArea: { type: Number },

    // Common
    scheduledDate: { type: Date, required: true },
    specialNote: { type: String },

    // Company response
    estimatedCost: { type: Number },
    companyNote: { type: String },

    status: {
      type: String,
      enum: ["pending", "quoted", "accepted", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;
