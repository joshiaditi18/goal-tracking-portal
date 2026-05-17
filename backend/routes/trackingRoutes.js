const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const { submitCheckin, getGoalCheckins, getPlannedVsActual } = require('../controllers/trackingController');

const router = express.Router();
router.use(protect);

router.post('/checkin/:goalId', authorizeRoles('employee', 'manager', 'admin'), submitCheckin);
router.get('/checkins', authorizeRoles('employee', 'manager', 'admin'), getGoalCheckins);
router.get('/planned-vs-actual', authorizeRoles('manager', 'admin'), getPlannedVsActual);

module.exports = router;
