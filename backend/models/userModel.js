import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: "General User",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

const User = mongoose.model("User", userSchema);
export default User;
