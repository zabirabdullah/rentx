import mongoose from "mongoose";

const propertySchema = mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    category: {
      type: String,
      required: true,
      enum: ["house", "office", "commercial_space", "godown", "garage", "atm_booth"],
    },

    address: { type: String, required: true },
    holdingNo: { type: String, required: true },
    area: { type: Number, required: true },

    rentPrice: { type: Number, required: true },
    salePrice: { type: Number, required: false }, // only if the owner also allows sale

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    images: [{ type: String, required: true }],
    description: { type: String },
    isAvailable: { type: Boolean, required: true, default: true },

    // Optional / category-dependent — not every category needs every field
    name: { type: String }, // e.g. building name
    storey: { type: Number },
    position: { type: String },
    elevator: { type: Boolean, default: false },
    bedroom: { type: Number },
    bathroom: { type: Number },
    balcony: { type: Number },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
