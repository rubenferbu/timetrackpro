const { body, param } = require("express-validator");

const updateEntryValidator = [
    param("id").isMongoId().withMessage("ID de fichaje no válido"),
    body("clockIn")
        .optional()
        .isISO8601()
        .withMessage("clockIn debe ser una fecha válida"),
    body("clockOut")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("clockOut debe ser una fecha válida"),
    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Las notas no pueden superar 500 caracteres"),
];

module.exports = { updateEntryValidator };
