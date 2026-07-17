const mongoose = require('mongoose');
const Company = require('../models/Company');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const generateToken = require('../utils/generateToken');

const registerCompany = catchAsync(async (req, res) => {
  const { companyName, adminName, adminEmail, adminPassword } = req.body;

  if (!companyName || !adminName || !adminEmail || !adminPassword) {
    throw new AppError('VALIDATION_ERROR', 400, 'Faltan campos obligatorios');
  }

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    throw new AppError('DUPLICATE_KEY', 409, 'Ese email ya está registrado');
  }

  const session = await mongoose.startSession();
  let company, admin;

  try {
    await session.withTransaction(async () => {
      company = await Company.create([{ name: companyName }], { session });
      company = company[0];

      admin = await User.create(
        [
          {
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'companyAdmin',
            companyId: company._id,
          },
        ],
        { session }
      );
      admin = admin[0];
    });
  } finally {
    await session.endSession();
  }

  const token = generateToken(admin);
  res.status(201).json({
    success: true,
    data: { token, user: admin.toSafeJSON(), company },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('VALIDATION_ERROR', 400, 'Email y contraseña son obligatorios');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    // Mensaje idéntico en ambos casos: nunca reveles si el email existe o no.
    throw new AppError('INVALID_CREDENTIALS', 401, 'Email o contraseña incorrectos');
  }

  if (!user.isActive) {
    throw new AppError('ACCOUNT_DISABLED', 403, 'Esta cuenta está desactivada');
  }

  if (user.companyId) {
    const company = await Company.findById(user.companyId);
    if (!company || company.status !== 'active') {
      throw new AppError('COMPANY_SUSPENDED', 403, 'El acceso de tu empresa está suspendido');
    }
  }

  const token = generateToken(user);
  res.status(200).json({
    success: true,
    data: { token, user: user.toSafeJSON() },
  });
});

const me = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).populate('companyId', 'name plan status');
  if (!user) {
    throw new AppError('NOT_FOUND', 404, 'Usuario no encontrado');
  }
  res.status(200).json({ success: true, data: { user: user.toSafeJSON() } });
});

module.exports = { registerCompany, login, me };