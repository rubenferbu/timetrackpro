const AppError = require('../utils/AppError');

// Debe ejecutarse SIEMPRE después de authMiddleware.
// Su única responsabilidad: decidir de qué companyId se filtran los datos
// de esta petición, y hacerlo de una fuente que el cliente no puede manipular.
function tenantMiddleware(req, res, next) {
  if (req.user.role === 'superAdmin') {
    // El superAdmin opera a nivel de plataforma, no de una empresa concreta.
    // Las rutas de empresa (companyAdmin/manager/employee) no deben ser
    // alcanzables por superAdmin sin pasar antes por un endpoint específico
    // de plataforma (ver módulo Companies, fuera del alcance de este middleware).
    req.companyId = null;
    return next();
  }

  if (!req.user.companyId) {
    return next(new AppError('FORBIDDEN', 403, 'El usuario no pertenece a ninguna empresa'));
  }

  req.companyId = req.user.companyId;
  next();
}

// Para las rutas que SÍ requieren una empresa (todo excepto los endpoints
// de plataforma del superAdmin), esto rechaza explícitamente el caso null.
function requireCompanyScope(req, res, next) {
  if (!req.companyId) {
    return next(new AppError('FORBIDDEN', 403, 'Esta acción requiere pertenecer a una empresa'));
  }
  next();
}

module.exports = { tenantMiddleware, requireCompanyScope };
