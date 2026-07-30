import mongoose from "mongoose";

const reportSchema = mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed", "action_taken"],
      default: "pending",
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
