import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The recipient of the notification
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { 
      type: String, 
      enum: ["system", "rental_request", "service_request", "report"], 
      default: "system" 
    },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // Optional ID to link to the specific property/request/report
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
