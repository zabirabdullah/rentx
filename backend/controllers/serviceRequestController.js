import ServiceRequest from "../models/serviceRequestModel.js";
import CompanyProfile from "../models/companyProfileModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import notify from "../utils/notify.js";

const createRequest = asyncHandler(async (req, res) => {
  const {
    companyId, serviceType, scheduledDate, specialNote,
    fromAddress, toAddress, furnitureItems, storey, elevatorAvailable,
    numberOfRooms, spaceArea,
  } = req.body;

  if (!companyId || !serviceType || !scheduledDate) {
    res.status(400);
    throw new Error("Company, service type, and scheduled date are required");
  }

  const company = await CompanyProfile.findById(companyId);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  if (!company.servicesOffered.includes(serviceType)) {
    res.status(400);
    throw new Error("This company does not offer the selected service");
  }

  if (serviceType === "moving") {
    if (!fromAddress || !toAddress) { res.status(400); throw new Error("Addresses required"); }
    if (!furnitureItems || furnitureItems.length === 0) { res.status(400); throw new Error("Furniture required"); }
    if (storey === undefined) { res.status(400); throw new Error("Storey required"); }
  }

  if (serviceType === "cleaning") {
    if (!numberOfRooms || !spaceArea) { res.status(400); throw new Error("Rooms and area required"); }
  }

  const serviceRequest = await ServiceRequest.create({
    requesterId: req.user._id, companyId, serviceType, scheduledDate, specialNote,
    fromAddress, toAddress, furnitureItems, storey, elevatorAvailable, numberOfRooms, spaceArea,
  });
  
  // Notify company that they have a new pending request
  await notify.sendToUser(company.userId, "New Service Request", `You have a new ${serviceType} request.`, "service_request", serviceRequest._id);

  res.status(201).json(serviceRequest);
});

const getMyRequests = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === "company") {
    const profile = await CompanyProfile.findOne({ userId: req.user._id });
    if (profile) query.companyId = profile._id;
  } else if (req.user.role !== "admin") {
    query.requesterId = req.user._id;
  }

  const requests = await ServiceRequest.find(query)
    .populate("requesterId", "name email phone")
    .populate({ path: "companyId", select: "businessName servicesOffered", populate: { path: "userId", select: "name email phone" } })
    .sort({ createdAt: -1 });
  res.json(requests);
});

const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, estimatedCost, companyNote } = req.body;
  const request = await ServiceRequest.findById(req.params.id);
  if (!request) { res.status(404); throw new Error("Service request not found"); }

  const company = await CompanyProfile.findById(request.companyId);
  const isCompany = company && company.userId.toString() === req.user._id.toString();
  const isRequester = request.requesterId.toString() === req.user._id.toString();

  if (!isCompany && !isRequester && req.user.role !== "admin") {
    res.status(403); throw new Error("Not authorized");
  }

  if (isCompany) {
    if (status === "quoted") {
      if (request.status !== "pending") { res.status(400); throw new Error("Can only quote a pending request"); }
      if (!estimatedCost || estimatedCost <= 0) { res.status(400); throw new Error("Estimated cost is required"); }
      request.estimatedCost = estimatedCost;
      request.companyNote = companyNote || request.companyNote;
    } else if (status === "in_progress") {
      if (request.status !== "accepted") { res.status(400); throw new Error("Must be accepted first"); }
    } else if (status === "completed") {
      if (request.status !== "in_progress") { res.status(400); throw new Error("Must be in progress first"); }
    }
  }

  if (isRequester) {
    if (status === "accepted" && request.status !== "quoted") { res.status(400); throw new Error("Must be quoted first"); }
    if (status === "cancelled" && !["pending", "quoted"].includes(request.status)) { res.status(400); throw new Error("Too late to cancel"); }
  }

  request.status = status;
  const updatedRequest = await request.save();
  
  if (isCompany) {
    await notify.serviceStatusChanged(request.requesterId, company.businessName, status, estimatedCost);
  }

  res.json(updatedRequest);
});

export { createRequest, getMyRequests, updateRequestStatus };
