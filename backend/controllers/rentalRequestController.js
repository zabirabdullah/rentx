import RentalRequest from "../models/rentalRequestModel.js";
import Property from "../models/propertyModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import notify from "../utils/notify.js";

// @desc    Create a rental request
// @route   POST /api/rental-requests
// @access  Private/Tenant
const createRequest = asyncHandler(async (req, res) => {
  const { propertyId, message, tenantNote } = req.body;

  if (!propertyId) {
    res.status(400);
    throw new Error("Property ID is required");
  }

  // Verify the property exists and is available
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  if (!property.isAvailable) {
    res.status(400);
    throw new Error("This property is no longer available for rent");
  }

  // Prevent tenants from requesting their own property (edge case if roles change)
  if (property.ownerId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot send a rental request for your own property");
  }

  // Prevent duplicate pending requests from the same tenant for the same property
  const existingRequest = await RentalRequest.findOne({
    propertyId,
    tenantId: req.user._id,
    status: "pending",
  });
  if (existingRequest) {
    res.status(400);
    throw new Error("You already have a pending request for this property");
  }

  const rentalRequest = await RentalRequest.create({
    propertyId,
    tenantId: req.user._id,
    ownerId: property.ownerId,
    message: message || tenantNote || "",
    tenantNote: tenantNote || message || "",
  });

  res.status(201).json(rentalRequest);
});

// @desc    Get my rental requests (tenant sees their requests, owner sees requests for their properties)
// @route   GET /api/rental-requests/my
// @access  Private (Tenant or Owner)
const getMyRequests = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === "tenant") {
    query.tenantId = req.user._id;
  } else if (req.user.role === "owner") {
    query.ownerId = req.user._id;
  } else if (req.user.role === "admin") {
    // Admin can see all requests — no filter needed
  } else {
    res.status(403);
    throw new Error("Not authorized to view rental requests");
  }

  const requests = await RentalRequest.find(query)
    .populate("propertyId", "address category rentPrice images")
    .populate("tenantId", "name email phone")
    .populate("ownerId", "name email phone");

  res.json(requests);
});

// @desc    Update rental request status (approve/reject by owner, cancel by tenant)
// @route   PUT /api/rental-requests/:id
// @access  Private (Owner or Tenant)
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, ownerNote, tenantNote } = req.body;
  const request = await RentalRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Rental request not found");
  }

  const isOwner = request.ownerId.toString() === req.user._id.toString();
  const isTenant = request.tenantId.toString() === req.user._id.toString();

  if (!isOwner && !isTenant && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this request");
  }

  // Validate allowed status transitions
  if (request.status === "pending") {
    if (isOwner) {
      if (!["approved", "rejected"].includes(status)) {
        res.status(400);
        throw new Error("Owner can only approve or reject a pending request");
      }
    } else if (isTenant) {
      if (status !== "cancelled") {
        res.status(400);
        throw new Error("Tenant can only cancel a pending request");
      }
    }
  } else if (request.status === "approved") {
    if (isOwner) {
      if (!["completed", "cancelled"].includes(status)) {
        res.status(400);
        throw new Error("Owner can only end or cancel an approved lease");
      }
    } else if (isTenant) {
      if (status !== "cancelled") {
        res.status(400);
        throw new Error("Tenant can only cancel an approved lease");
      }
    }
  } else {
    res.status(400);
    throw new Error(`Cannot update a request that is already ${request.status}`);
  }

  const previousStatus = request.status;
  request.status = status;
  if (isOwner && ownerNote) request.ownerNote = ownerNote;
  if (isTenant && tenantNote) request.tenantNote = tenantNote;

  const updatedRequest = await request.save();

  // If approved, make property unavailable and reject other pending requests
  if (status === "approved" && previousStatus !== "approved") {
    const property = await Property.findById(request.propertyId);
    if (property) {
      property.isAvailable = false;
      await property.save();

      await RentalRequest.updateMany(
        { propertyId: request.propertyId, status: "pending", _id: { $ne: request._id } },
        { status: "rejected", ownerNote: "Property has been rented out to someone else." }
      );
    }
  }

  // If lease ended/cancelled after being approved, make property available again!
  if (previousStatus === "approved" && ["completed", "cancelled"].includes(status)) {
    const property = await Property.findById(request.propertyId);
    if (property) {
      property.isAvailable = true;
      await property.save();
    }
  }

  // Trigger Notification to Tenant
  const property = await Property.findById(request.propertyId).select("address");
  if (property) {
    await notify.rentalStatusChanged(request.tenantId, request.ownerId, property.address, status);
  }

  res.json(updatedRequest);
});

export { createRequest, getMyRequests, updateRequestStatus };
