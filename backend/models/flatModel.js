import mongoose from "mongoose";

const flatSchema = mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    address: { type: String, required: true },
    name: { type: String, required: true },
    number: { type: String, required: false },
    holdingNo: { type: String, required: true },
    type: { type: String, required: true, enum: ["house", "apartment"] },
    area: { type: Number, required: true },
    price: { type: Number, required: true },
    service: { type: Number, required: true },

    bedroom: { type: Number, required: true, default: 1 },
    bathroom: { type: Number, required: true, default: 1 },
    balcony: { type: Number, required: true, default: 0 },

    storey: { type: Number, required: true },
    position: { type: String, required: true },

    images: [{ type: String, required: true }],
    description: { type: String },
    isAvailable: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

const Flat = mongoose.model("Flat", flatSchema);
export default Flat;
