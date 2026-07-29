import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true }, // links to Firebase Auth account
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["tenant", "owner", "company", "admin"],
      default: "tenant",
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
