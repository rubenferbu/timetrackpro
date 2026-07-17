const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('UNAUTHORIZED', 401, 'Token no proporcionado'));
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.userId,
      companyId: payload.companyId,
      role: payload.role,
    };
    next();
  } catch (err) {
    next(new AppError('UNAUTHORIZED', 401, 'Token inválido o caducado'));
  }
}

module.exports = authMiddleware;
