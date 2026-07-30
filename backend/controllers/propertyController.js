import Property from "../models/propertyModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all properties (with basic filtering)
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, search, lat, lng, radius } = req.query;

  let query = { isAvailable: true }; // Only show available properties by default

  if (category) {
    query.category = category;
  }
  if (minPrice || maxPrice) {
    query.rentPrice = {};
    if (minPrice) query.rentPrice.$gte = Number(minPrice);
    if (maxPrice) query.rentPrice.$lte = Number(maxPrice);
  }

  // 3. Text Search (Matches address, name, or description)
  if (search) {
    query.$or = [
      { address: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  // 4. Location Radius Filter (Approximate Bounding Box)
  if (lat && lng && radius) {
    const r = Number(radius);
    const latNum = Number(lat);
    const lngNum = Number(lng);
    
    // 1 degree latitude ~= 111 km
    const latDelta = r / 111;
    // 1 degree longitude ~= 111 * cos(latitude) km
    const lngDelta = r / (111 * Math.cos(latNum * (Math.PI / 180)));

    query["location.lat"] = { $gte: latNum - latDelta, $lte: latNum + latDelta };
    query["location.lng"] = { $gte: lngNum - lngDelta, $lte: lngNum + lngDelta };
  }

  // Populate owner details so the frontend can display contact info
  const properties = await Property.find(query).populate("ownerId", "name email phone");

  // Strip phone from owner if showPhone is false
  const results = properties.map((p) => {
    const obj = p.toObject();
    if (!obj.showPhone && obj.ownerId) {
      delete obj.ownerId.phone;
    }
    return obj;
  });

  res.json(results);
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate("ownerId", "name email phone");

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // If the property is not available, only the owner or an admin can view it
  if (!property.isAvailable) {
    if (!req.user || (property.ownerId._id.toString() !== req.user._id.toString() && req.user.role !== "admin")) {
      res.status(404);
      throw new Error("Property not found or is no longer available");
    }
  }
  // Strip phone from owner data if showPhone is false and viewer is not the owner
  const result = property.toObject();
  const isOwnerViewing = req.user && property.ownerId._id.toString() === req.user._id.toString();
  if (!result.showPhone && !isOwnerViewing && result.ownerId) {
    delete result.ownerId.phone;
  }

  res.json(result);
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Owner
const createProperty = asyncHandler(async (req, res) => {
  const {
    category, address, holdingNo, area, rentPrice, salePrice, location,
    images, description, name, storey, position, elevator, bedroom, bathroom, balcony
  } = req.body;

  // Basic required fields check
  if (
    !category || !address || !holdingNo || !area || !rentPrice ||
    storey === undefined || elevator === undefined ||
    !location || !location.lat || !location.lng ||
    !images || images.length === 0
  ) {
    res.status(400);
    throw new Error("Please provide all required fields (category, address, holdingNo, area, rentPrice, storey, elevator, location, images)");
  }

  const allowedCategories = ["house", "office", "commercial_space", "godown", "garage", "atm_booth"];
  if (!allowedCategories.includes(category)) {
    res.status(400);
    throw new Error("Invalid category selected. No other values allowed.");
  }

  // Category specific validation
  if (category === "house" && (!bedroom || !bathroom)) {
    res.status(400);
    throw new Error("Bedroom and bathroom count are required when listing a house");
  }

  const property = new Property({
    ownerId: req.user._id, // Set automatically from the auth token
    category, address, holdingNo, area, rentPrice, salePrice, location,
    images, description, name, storey, position, elevator, bedroom, bathroom, balcony,
    showPhone: req.body.showPhone || false,
  });

  const createdProperty = await property.save();
  res.status(201).json(createdProperty);
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Owner
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // Security Check: Only the owner who created it can edit it
  if (property.ownerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You do not have permission to update this property");
  }

  const {
    category, address, holdingNo, area, rentPrice, salePrice, location,
    images, description, name, storey, position, elevator, bedroom, bathroom, balcony, isAvailable
  } = req.body;

  // Category validation if category is being updated
  const newCategory = category || property.category;
  if (newCategory === "house") {
    const newBedroom = bedroom !== undefined ? bedroom : property.bedroom;
    const newBathroom = bathroom !== undefined ? bathroom : property.bathroom;
    if (!newBedroom || !newBathroom) {
      res.status(400);
      throw new Error("Bedroom and bathroom count are required for houses");
    }
  }

  property.category = category || property.category;
  property.address = address || property.address;
  property.holdingNo = holdingNo || property.holdingNo;
  property.area = area || property.area;
  property.rentPrice = rentPrice || property.rentPrice;
  property.salePrice = salePrice !== undefined ? salePrice : property.salePrice;
  property.location = location || property.location;
  property.images = images || property.images;
  property.description = description || property.description;
  property.name = name || property.name;
  property.storey = storey || property.storey;
  property.position = position || property.position;
  property.elevator = elevator !== undefined ? elevator : property.elevator;
  property.bedroom = bedroom || property.bedroom;
  property.bathroom = bathroom || property.bathroom;
  property.balcony = balcony || property.balcony;
  property.isAvailable = isAvailable !== undefined ? isAvailable : property.isAvailable;
  property.showPhone = req.body.showPhone !== undefined ? req.body.showPhone : property.showPhone;

  const updatedProperty = await property.save();
  res.json(updatedProperty);
});

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Owner or Admin
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // Security Check: Only the owner or an admin can delete it
  if (property.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You do not have permission to delete this property");
  }

  await property.deleteOne();
  res.json({ message: "Property removed" });
});

export { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
