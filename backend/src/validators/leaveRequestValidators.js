const { body, param } = require('express-validator');

const createLeaveRequestValidator = [
    body('type').isIn(['vacation', 'sick', 'personal']).withMessage('Tipo de ausencia no válido'),
    body('startDate').isISO8601().withMessage('startDate debe ser una fecha válida'),
    body('endDate').isISO8601().withMessage('endDate debe ser una fecha válida'),
];

const requestIdValidator = [param('id').isMongoId().withMessage('ID de solicitud no válido')];

module.exports = { createLeaveRequestValidator, requestIdValidator };