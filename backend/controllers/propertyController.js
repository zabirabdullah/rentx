import Property from "../models/propertyModel.js";
import asyncHandler from "../utils/asyncHandler.js";

const allowedCategories = ["house", "office", "commercial_space", "godown", "garage", "atm_booth"];

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? null : numericValue;
};

const normalizeLocation = ({ location, latitude, longitude, lat, lng }) => {
  if (location && typeof location === "object") {
    const latValue = location.lat ?? location.latitude;
    const lngValue = location.lng ?? location.longitude;

    if (latValue === undefined || lngValue === undefined) {
      return null;
    }

    const lat = Number(latValue);
    const lng = Number(lngValue);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return null;
    }

    return { lat, lng };
  }

  if (latitude === undefined && longitude === undefined) {
    if (lat === undefined && lng === undefined) {
      return null;
    }

    if (lat === undefined || lng === undefined) {
      return null;
    }

    const numericLat = Number(lat);
    const numericLng = Number(lng);

    if (Number.isNaN(numericLat) || Number.isNaN(numericLng)) {
      return null;
    }

    return { lat: numericLat, lng: numericLng };
  }

  if (latitude === undefined || longitude === undefined) {
    return null;
  }

  const parsedLat = Number(latitude);
  const parsedLng = Number(longitude);

  if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
    return null;
  }

  return { lat: parsedLat, lng: parsedLng };
};

const calculateDistanceKm = (lat1, lng1, lat2, lng2) => {
  const earthRadiusKm = 6371;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
};

const buildPropertyQuery = (queryParams, { availableOnly = true } = {}) => {
  const { category, minPrice, maxPrice, search, lat, lng, radius } = queryParams;
  const query = {};
  const numericLat = toNumber(lat);
  const numericLng = toNumber(lng);
  const numericRadius = toNumber(radius);

  if (availableOnly) {
    query.isAvailable = true;
  }

  if (category) {
    query.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.rentPrice = {};
    if (minPrice !== undefined) query.rentPrice.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.rentPrice.$lte = Number(maxPrice);
  }

  if (search) {
    query.$or = [
      { address: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  let locationFilter = null;
  if (numericLat !== undefined || numericLng !== undefined || numericRadius !== undefined) {
    if (numericLat === null || numericLng === null || numericRadius === null) {
      return { query, locationFilter: { invalid: true } };
    }

    const latDelta = numericRadius / 111;
    const lngDelta = numericRadius / (111 * Math.cos((numericLat * Math.PI) / 180));

    query["location.lat"] = { $gte: numericLat - latDelta, $lte: numericLat + latDelta };
    query["location.lng"] = { $gte: numericLng - lngDelta, $lte: numericLng + lngDelta };

    locationFilter = {
      lat: numericLat,
      lng: numericLng,
      radius: numericRadius,
    };
  }

  return { query, locationFilter };
};

const formatProperty = (property, viewerId) => {
  const obj = property.toObject();
  const ownerId = obj.ownerId;
  const isOwnerViewing = viewerId && ownerId && ownerId._id && ownerId._id.toString() === viewerId.toString();

  if (!obj.showPhone && !isOwnerViewing && ownerId) {
    delete ownerId.phone;
  }

  if (obj.location) {
    obj.lat = obj.location.lat;
    obj.lng = obj.location.lng;
  }

  return obj;
};

const formatMapProperty = (property, viewerId, locationFilter = null) => {
  const obj = formatProperty(property, viewerId);

  if (locationFilter && obj.location) {
    obj.distanceKm = Number(
      calculateDistanceKm(locationFilter.lat, locationFilter.lng, obj.location.lat, obj.location.lng).toFixed(2)
    );
  }

  return obj;
};

// @desc    Get all properties (with filtering, search, and radius)
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  // buildPropertyQuery automatically handles text search and location radius
  const { query, locationFilter } = buildPropertyQuery(req.query);

  if (locationFilter && locationFilter.invalid) {
    res.status(400);
    throw new Error("Latitude, longitude, and radius must all be valid numbers");
  }

  // Populate owner details so the frontend can display contact info
  const properties = await Property.find(query).populate("ownerId", "name email phone");

  // Format properties (strips hidden phones) and calculates distanceKm if locationFilter exists
  let results = properties.map((property) => formatMapProperty(property, req.user?._id, locationFilter));

  // If a location search was used, automatically sort by closest distance
  if (locationFilter) {
    results = results.sort((left, right) => {
      if (left.distanceKm === undefined || right.distanceKm === undefined) {
        return 0;
      }
      return left.distanceKm - right.distanceKm;
    });
  }

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
  const result = formatProperty(property, req.user?._id);

  res.json(result);
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Owner
const createProperty = asyncHandler(async (req, res) => {
  const {
    category, address, holdingNo, area, rentPrice, salePrice, location,
    images, description, name, storey, position, elevator, bedroom, bathroom, balcony, availableFrom,
    latitude, longitude, lat, lng,
  } = req.body;

  const normalizedLocation = normalizeLocation({ location, latitude, longitude, lat, lng });

  // Basic required fields check
  if (
    !category || !address || !holdingNo || !area || !rentPrice ||
    storey === undefined || elevator === undefined ||
    !normalizedLocation ||
    !images || images.length === 0
  ) {
    res.status(400);
    throw new Error("Please provide all required fields (category, address, holdingNo, area, rentPrice, storey, elevator, location, images)");
  }

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
    category, address, holdingNo, area, rentPrice, salePrice, location: normalizedLocation,
    images, description, name, storey, position, elevator, bedroom, bathroom, balcony, availableFrom,
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
    images, description, name, storey, position, elevator, bedroom, bathroom, balcony, isAvailable, availableFrom,
    latitude, longitude, lat, lng,
  } = req.body;

  const normalizedLocation = normalizeLocation({ location, latitude, longitude, lat, lng });
  const hasLocationInput = location !== undefined || latitude !== undefined || longitude !== undefined || lat !== undefined || lng !== undefined;

  if (hasLocationInput && !normalizedLocation) {
    res.status(400);
    throw new Error("Please provide a valid location with latitude and longitude");
  }

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
  property.location = normalizedLocation || property.location;
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
  property.availableFrom = availableFrom !== undefined ? availableFrom : property.availableFrom;
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
