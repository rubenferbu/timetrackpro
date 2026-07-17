const TimeEntry = require("../models/TimeEntry");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { getPagination } = require("../utils/paginate");
const getTeamUserIds = require('../utils/getTeamUserIds');

function applyDateRange(filter, req) {
  if (req.query.from || req.query.to) {
    filter.clockIn = {};
    if (req.query.from) filter.clockIn.$gte = new Date(req.query.from);
    if (req.query.to) filter.clockIn.$lte = new Date(req.query.to);
  }
}

const clockIn = catchAsync(async (req, res) => {
  const openEntry = await TimeEntry.findOne({
    userId: req.user.id,
    companyId: req.companyId,
    clockOut: null,
  });

  if (openEntry) {
    throw new AppError(
      "ALREADY_CLOCKED_IN",
      409,
      "Ya tienes un fichaje abierto",
    );
  }

  const entry = await TimeEntry.create({
    companyId: req.companyId,
    userId: req.user.id,
    clockIn: new Date(),
  });

  res.status(201).json({ success: true, data: entry });
});

const clockOut = catchAsync(async (req, res) => {
  const openEntry = await TimeEntry.findOne({
    userId: req.user.id,
    companyId: req.companyId,
    clockOut: null,
  }).sort({ clockIn: -1 });

  if (!openEntry) {
    throw new AppError(
      "NO_OPEN_ENTRY",
      409,
      "No tienes ningún fichaje abierto",
    );
  }

  openEntry.clockOut = new Date();
  if (req.body.notes) openEntry.notes = req.body.notes;
  await openEntry.save();

  res.status(200).json({ success: true, data: openEntry });
});

const listMyEntries = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const filter = { userId: req.user.id, companyId: req.companyId };
  applyDateRange(filter, req);

  const [entries, total] = await Promise.all([
    TimeEntry.find(filter).sort({ clockIn: -1 }).skip(skip).limit(limit),
    TimeEntry.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: entries,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

const listTeamEntries = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const teamIds = await getTeamUserIds(req);

  const filter = { companyId: req.companyId, userId: { $in: teamIds } };

  if (req.query.userId) {
    if (!teamIds.map(String).includes(req.query.userId)) {
      throw new AppError(
        "FORBIDDEN",
        403,
        "Ese usuario no pertenece a tu equipo",
      );
    }
    filter.userId = req.query.userId;
  }

  applyDateRange(filter, req);

  const [entries, total] = await Promise.all([
    TimeEntry.find(filter)
      .populate("userId", "name email")
      .sort({ clockIn: -1 })
      .skip(skip)
      .limit(limit),
    TimeEntry.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: entries,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

const updateEntry = catchAsync(async (req, res) => {
  const teamIds = await getTeamUserIds(req);

  const entry = await TimeEntry.findOne({
    _id: req.params.id,
    companyId: req.companyId,
    userId: { $in: teamIds },
  });

  if (!entry) {
    throw new AppError("NOT_FOUND", 404, "Fichaje no encontrado");
  }

  const { clockIn: newClockIn, clockOut: newClockOut, notes } = req.body;
  if (newClockIn) entry.clockIn = new Date(newClockIn);
  if (newClockOut !== undefined)
    entry.clockOut = newClockOut ? new Date(newClockOut) : null;
  if (notes !== undefined) entry.notes = notes;

  if (entry.clockOut && entry.clockOut <= entry.clockIn) {
    throw new AppError(
      "VALIDATION_ERROR",
      400,
      "La hora de salida debe ser posterior a la de entrada",
    );
  }

  await entry.save();
  res.status(200).json({ success: true, data: entry });
});

module.exports = {
  clockIn,
  clockOut,
  listMyEntries,
  listTeamEntries,
  updateEntry,
};
