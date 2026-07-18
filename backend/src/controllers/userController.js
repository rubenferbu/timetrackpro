const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { getPagination } = require('../utils/paginate');

const CREATABLE_ROLES = ['employee', 'manager'];
const listUsers = catchAsync(async (req, res) => {
    const { page, limit, skip } = getPagination(req);

    const filter = { companyId: req.companyId };
    if (req.query.role) filter.role = req.query.role;

    const [users, total] = await Promise.all([
        User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1}),
        User.countDocuments(filter),
    ]);

    res.status(200).json({
        success: true,
        data: users.map((u) => u.toSafeJSON()),
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
});

const getUser = catchAsync(async (req, res) => {
    const user = await User.findOne({_id: req.params.id, companyId: req.companyId });
    if (!user) {
        throw new AppError ('NOT_FOUND', 404, 'Usuario no encontrado');
    }
    res.status(200).json({ success: true, data: user.toSafeJSON() });
});

const createUser = catchAsync(async (req, res) => {
  const { name, email, password, role, managerId } = req.body;

  if (!name || !email || !password || !role) {
    throw new AppError('VALIDATION_ERROR', 400, 'Faltan campos obligatorios');
  }

  if (!CREATABLE_ROLES.includes(role)) {
    throw new AppError('VALIDATION_ERROR', 400, `El rol debe ser uno de: ${CREATABLE_ROLES.join(', ')}`);
  }

  if (managerId) {
    const manager = await User.findOne({
      _id: managerId,
      companyId: req.companyId,
      role: { $in: ['manager', 'companyAdmin'] },
    });
    if (!manager) {
      throw new AppError('VALIDATION_ERROR', 400, 'El manager indicado no es válido para esta empresa');
    }
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('DUPLICATE_KEY', 409, 'Ese email ya está registrado');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    companyId: req.companyId,
    managerId: managerId || null,
  });

  res.status(201).json({ success: true, data: user.toSafeJSON() });
});

const updateUser = catchAsync(async (req, res) => {
  const allowedFields = ['name', 'role', 'managerId', 'isActive'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  if (updates.role && !CREATABLE_ROLES.includes(updates.role)) {
    throw new AppError('VALIDATION_ERROR', 400, `El rol debe ser uno de: ${CREATABLE_ROLES.join(', ')}`);
  }

  const user = await User.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    updates,
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('NOT_FOUND', 404, 'Usuario no encontrado');
  }

  res.status(200).json({ success: true, data: user.toSafeJSON() });
});

const deactivateUser = catchAsync(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, companyId: req.companyId },
    { isActive: false },
    { new: true }
  );

  if (!user) {
    throw new AppError('NOT_FOUND', 404, 'Usuario no encontrado');
  }

  res.status(200).json({ success: true, data: user.toSafeJSON() });
});

module.exports = { listUsers, getUser, createUser, updateUser, deactivateUser };
