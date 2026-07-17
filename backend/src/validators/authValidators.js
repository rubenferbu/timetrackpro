const { body } = require("express-validator");

const registerCompanyValidator = [
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la empresa es obligatorio"),
  body("adminName")
    .trim()
    .notEmpty()
    .withMessage("El nombre del administrador es obligatorio"),
  body("adminEmail")
    .trim()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  body("adminPassword")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

module.exports = { registerCompanyValidator, loginValidator };
