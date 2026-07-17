const { body, param } = require("express-validator");

const createUserValidator = [
    body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Debe ser un email válido")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres"),
    body("role")
        .isIn(["employee", "manager"])
        .withMessage("El rol debe ser employee o manager"),
    body("managerId")
        .optional()
        .isMongoId()
        .withMessage("managerId no es un ID válido"),
];

const updateUserValidator = [
    param("id").isMongoId().withMessage("ID de usuario no válido"),
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("El nombre no puede estar vacío"),
    body("role")
        .optional()
        .isIn(["employee", "manager"])
        .withMessage("El rol debe ser employee o manager"),
    body("managerId")
        .optional()
        .isMongoId()
        .withMessage("managerId no es un ID válido"),
    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive debe ser true o false"),
];

module.exports = { createUserValidator, updateUserValidator };
