const { body, param } = require('express-validator');

const updateCompanyValidator = [
    param('id').isMongoId().withMessage('ID de empresa no válido'),
    body('plan').optional().isIn(['free', 'basic', 'premium']).withMessage('Plan no válido'),
    body('status').optional().isIn(['active', 'suspended']).withMessage('Estado no válido'),
];

module.exports = { updateCompanyValidator };