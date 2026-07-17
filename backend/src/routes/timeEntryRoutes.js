const express = require('express');
const {
    clockIn,
    clockOut,
    listMyEntries,
    listTeamEntries,
    updateEntry,
} = require('../controllers/timeEntryController');
const authMiddleware = require('../middlewares/authMiddleware');
const { tenantMiddleware, requireCompanyScope } = require('../middlewares/tenantMiddleware');
const requireRole = require('../middlewares/requireRole');
const validate = require('../middlewares/validate');
const { updateEntryValidator } = require('../validators/timeEntryValidators');

const router = express.Router();

router.use(authMiddleware, tenantMiddleware, requireCompanyScope);

router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.get('/', listMyEntries);
router.get('/team', requireRole('manager', 'companyAdmin'), listTeamEntries);
router.patch('/:id', requireRole('manager', 'companyAdmin'), updateEntryValidator, validate, updateEntry);

module.exports = router;