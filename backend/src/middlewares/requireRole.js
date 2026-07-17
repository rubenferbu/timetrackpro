const AppError = require('../utils/AppError');

// Uso: router.patch('/:id', authMiddleware, tenantMiddleware, requireRole('companyAdmin'), controller)
function requireRole(...allowedRoles) {
  return function roleCheck(req, res, next) {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('FORBIDDEN', 403, 'No tienes permiso para realizar esta acción')
      );
    }
    next();
  };
}

module.exports = requireRole;
