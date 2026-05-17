const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const { getAuditTrail } = require('../controllers/auditController');

const router = express.Router();
router.use(protect);

router.get('/', authorizeRoles('admin', 'manager'), getAuditTrail);

module.exports = router;
