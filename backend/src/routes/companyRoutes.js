const express = require('express');
const { listCompanies, getCompany, updateCompany } = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/requireRole');
const validate = require('../middlewares/validate');
const { updateCompanyValidator } = require('../validators/companyValidators');

const router = express.Router();

router.use(authMiddleware, requireRole('superAdmin'));

router.get('/', listCompanies);
router.get('/:id', getCompany);
router.patch('/:id', updateCompanyValidator, validate, updateCompany);

module.exports = router;