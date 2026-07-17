const express = require('express');
const {
    createLeaveRequest,
    listMyRequests,
    listTeamRequests,
    approveRequest,
    rejectRequest,
} = require('../controllers/leaveRequestController');
const authMiddleware = require('../middlewares/authMiddleware');
const { tenantMiddleware, requireCompanyScope } = require('../middlewares/tenantMiddleware');
const requireRole = require('../middlewares/requireRole');
const validate = require('../middlewares/validate');
const { createLeaveRequestValidator, requestIdValidator } = require('../validators/leaveRequestValidators');

const router = express.Router();

router.use(authMiddleware, tenantMiddleware, requireCompanyScope);

router.post('/', createLeaveRequestValidator, validate, createLeaveRequest);
router.get('/', listMyRequests);
router.get('/team', requireRole('manager', 'companyAdmin'), listTeamRequests);
router.patch('/:id/approve', requireRole('manager', 'companyAdmin'), requestIdValidator, validate, approveRequest);
router.patch('/:id/reject', requireRole('manager', 'companyAdmin'), requestIdValidator, validate, rejectRequest);

module.exports = router;