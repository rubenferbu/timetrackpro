const Company = require("../models/Company");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { getPagination } = require("../utils/paginate");

const listCompanies = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.plan) filter.plan = req.query.plan;

  const [companies, total] = await Promise.all([
    Company.find(filter).sort({ createAt: -1 }).skip(skip).limit(limit),
    Company.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: companies,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

const getCompany = catchAsync(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    throw new AppError("NOT_FOUND", 404, "Empresa no encontrada");
  }
  res.status(200).json({
    success: true,
    data: company,
  });
});

const updateCompany = catchAsync(async (req, res) => {
  const allowedFields = ["plan", "status"];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  const company = await Company.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  
  if (!company) {
    throw new AppError("NOT_FOUND", 404, "Empresa no encontrada");
  }

  res.status(200).json({
    success: true,
    data: company,
  });
});

module.exports = { listCompanies, getCompany, updateCompany };
