const AppError = require('../utils/AppError');

function notFoundHandler(req, res, next) {
  next(new AppError('NOT_FOUND', 404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

function normalizeError(err) {
  // Errores conocidos y ya bien formados
  if (err instanceof AppError) return err;

  // Errores de validación de Mongoose (schema required/enum/minlength, etc.)
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return new AppError('VALIDATION_ERROR', 400, 'Los datos enviados no son válidos', details);
  }

  // Un ObjectId con formato inválido en la URL (ej. /users/abc en vez de un ObjectId real).
  if (err.name === 'CastError') {
    return new AppError('INVALID_ID', 400, `Identificador inválido: ${err.value}`);
  }

  // Índice único violado (ej. email duplicado).
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    return new AppError('DUPLICATE_KEY', 409, `Ya existe un registro con ese ${field}`);
  }

  // Cualquier otra cosa: no filtramos el mensaje interno al cliente.
  return new AppError('INTERNAL_ERROR', 500, 'Ha ocurrido un error interno');
}

function errorHandler(err, req, res, next) {
  const normalized = normalizeError(err);

  if (normalized.statusCode >= 500) {
    // Solo los errores no operacionales/inesperados se registran con stack completo.
    console.error(err);
  }

  res.status(normalized.statusCode).json({
    success: false,
    error: {
      code: normalized.code,
      message: normalized.message,
      details: normalized.details,
    },
  });
}

module.exports = { errorHandler, notFoundHandler };
