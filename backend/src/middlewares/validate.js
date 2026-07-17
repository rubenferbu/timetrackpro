const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

// Se coloca después de las cadenas de validación de express-validator.
// Si hay errores, los traduce a nuestro formato AppError habitual.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const details = errors.array().map((e) => `${e.path}: ${e.msg}`);
  next(
    new AppError(
      "VALIDATION_ERROR",
      400,
      "Los datos enviados no son válidos",
      details,
    ),
  );
}

module.exports = validate;
