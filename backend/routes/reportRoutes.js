const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  employeeAchievementReport,
  exportAchievementCsv,
  exportAchievementExcel,
  completionDashboard,
  pendingUsersReport,
} = require('../controllers/reportController');

const router = express.Router();
router.use(protect);

router.get('/achievements', authorizeRoles('employee', 'manager', 'admin'), employeeAchievementReport);
router.get('/achievements/export/csv', authorizeRoles('employee', 'manager', 'admin'), exportAchievementCsv);
router.get('/achievements/export/excel', authorizeRoles('employee', 'manager', 'admin'), exportAchievementExcel);
router.get('/dashboard', authorizeRoles('manager', 'admin'), completionDashboard);
router.get('/pending', authorizeRoles('manager', 'admin'), pendingUsersReport);

module.exports = router;
