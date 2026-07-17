const express = require('express');
const {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deactivateUser,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { tenantMiddleware, requireCompanyScope } = require('../middlewares/tenantMiddleware');
const requireRole = require('../middlewares/requireRole');

const router = express.Router();

// Todas las rutas de este módulo requieren estar autenticado y pertenecer a una empresa.
router.use(authMiddleware, tenantMiddleware, requireCompanyScope);

router.get('/', requireRole('companyAdmin', 'manager'), listUsers);
router.get('/:id', requireRole('companyAdmin', 'manager'), getUser);
router.post('/', requireRole('companyAdmin'), createUser);
router.patch('/:id', requireRole('companyAdmin'), updateUser);
router.delete('/:id', requireRole('companyAdmin'), deactivateUser);

module.exports = router;