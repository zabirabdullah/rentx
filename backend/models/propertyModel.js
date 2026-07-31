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
    availableFrom: { type: Date }, // Optional: date when property becomes available

    // Optional / category-dependent — not every category needs every field
    name: { type: String }, // e.g. building name
    storey: { type: Number, required: true },
    position: { type: String },
    elevator: { type: Boolean, required: true, default: false },
    bedroom: { type: Number },
    bathroom: { type: Number },
    balcony: { type: Number },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

propertySchema.virtual("mainImage").get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

propertySchema.virtual("latitude").get(function () {
  return this.location?.lat;
});

propertySchema.virtual("latitude").set(function (value) {
  this.location = this.location || {};
  this.location.lat = value;
});

propertySchema.virtual("longitude").get(function () {
  return this.location?.lng;
});

propertySchema.virtual("longitude").set(function (value) {
  this.location = this.location || {};
  this.location.lng = value;
});

propertySchema.index({ "location.lat": 1, "location.lng": 1 });
propertySchema.index({ isAvailable: 1, category: 1, rentPrice: 1 });

const Property = mongoose.model("Property", propertySchema);
export default Property;
