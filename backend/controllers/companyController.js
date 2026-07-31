import CompanyProfile from "../models/companyProfileModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all companies (with optional filter by service type)
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const { service } = req.query;
  let query = {};
  
  if (service) {
    // MongoDB will match if the service is anywhere in the servicesOffered array
    query.servicesOffered = service;
  }
  
  const companies = await CompanyProfile.find(query).populate("userId", "name email phone address");
  res.json(companies);
});

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await CompanyProfile.findById(req.params.id).populate("userId", "name email phone address");
  
  if (company) {
    res.json(company);
  } else {
    res.status(404);
    throw new Error("Company profile not found");
  }
});

// @desc    Create company profile
// @route   POST /api/companies
// @access  Private/Company
const createProfile = asyncHandler(async (req, res) => {
  const { businessName, servicesOffered, baseRates, description } = req.body;
  
  // Check if profile already exists for this user (1:1 relationship)
  const existingProfile = await CompanyProfile.findOne({ userId: req.user._id });
  if (existingProfile) {
    res.status(400);
    throw new Error("A company profile already exists for your account");
  }
  
  if (!businessName || !servicesOffered || servicesOffered.length === 0) {
    res.status(400);
    throw new Error("Business name and at least one service offered are required");
  }
  
  const company = new CompanyProfile({
    userId: req.user._id,
    businessName,
    servicesOffered,
    baseRates,
    description
  });
  
  const createdCompany = await company.save();
  res.status(201).json(createdCompany);
});

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private/Company
const updateProfile = asyncHandler(async (req, res) => {
  const { businessName, servicesOffered, baseRates, description } = req.body;
  
  const company = await CompanyProfile.findById(req.params.id);
  
  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }
  
  // Security Check: Ensure the company profile belongs to the user trying to update it
  if (company.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You do not have permission to update this profile");
  }
  
  company.businessName = businessName || company.businessName;
  company.servicesOffered = servicesOffered || company.servicesOffered;
  company.baseRates = baseRates || company.baseRates;
  company.description = description || company.description;
  
  const updatedCompany = await company.save();
  res.json(updatedCompany);
});

// @desc    Get current company's profile
// @route   GET /api/companies/my
// @access  Private/Company
const getMyProfile = asyncHandler(async (req, res) => {
  const company = await CompanyProfile.findOne({ userId: req.user._id }).populate("userId", "name email phone address");
  
  if (company) {
    res.json(company);
  } else {
    // If they haven't created a profile yet, return null instead of 404 so frontend can show "Create Profile" form
    res.json(null);
  }
});

// @desc    Delete a company profile
// @route   DELETE /api/companies/:id
// @access  Private/Admin
const deleteCompanyProfile = asyncHandler(async (req, res) => {
  const company = await CompanyProfile.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  await CompanyProfile.findByIdAndDelete(req.params.id);
  res.json({ message: "Company profile deleted successfully" });
});

export { getCompanies, getCompanyById, getMyProfile, createProfile, updateProfile, deleteCompanyProfile };
