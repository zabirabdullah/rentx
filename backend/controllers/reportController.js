import Report from "../models/reportModel.js";
import Property from "../models/propertyModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import notify from "../utils/notify.js";

const createReport = asyncHandler(async (req, res) => {
  const { propertyId, reason } = req.body;
  
  if (!propertyId || !reason) {
    res.status(400);
    throw new Error("Property ID and reason are required");
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.ownerId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot report your own property");
  }

  const existingReport = await Report.findOne({ propertyId, reportedBy: req.user._id });
  if (existingReport) {
    res.status(400);
    throw new Error("You have already reported this property");
  }

  const report = await Report.create({ propertyId, reportedBy: req.user._id, reason });

  // Trigger admin notification if reports are piling up
  const reportCount = await Report.countDocuments({ propertyId, status: "pending" });
  if (reportCount >= 3) {
    await notify.adminHighReportAlert(propertyId, reportCount);
  }

  res.status(201).json(report);
});

const getReports = asyncHandler(async (req, res) => {
  const { status } = req.query;
  let query = {};
  if (status) query.status = status;

  const reports = await Report.find(query)
    .populate("propertyId", "address category images")
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 });
  res.json(reports);
});

const updateReport = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;
  const report = await Report.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  const allowedStatuses = ["reviewed", "dismissed", "action_taken"];
  if (status && !allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status. Allowed: reviewed, dismissed, action_taken");
  }

  if (status) report.status = status;
  if (adminNote) report.adminNote = adminNote;

  const updatedReport = await report.save();
  res.json(updatedReport);
});

export { createReport, getReports, updateReport };
