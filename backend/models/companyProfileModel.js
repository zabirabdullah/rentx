import mongoose from "mongoose";

const companyProfileSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessName: { type: String, required: true },
    servicesOffered: [
      {
        type: String,
        enum: ["moving", "cleaning", "electrician", "plumbing", "painting"],
      },
    ],
    baseRates: {
      type: Map,
      of: Number, // Example: { moving: 500, cleaning: 200 }
    },
    description: { type: String },
  },
  { timestamps: true }
);

const CompanyProfile = mongoose.model("CompanyProfile", companyProfileSchema);
export default CompanyProfile;
