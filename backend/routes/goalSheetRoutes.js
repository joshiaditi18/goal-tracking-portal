const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  saveDraft,
  submitSheet,
  approveSheet,
  rejectSheet,
  returnForRework,
  unlockSheet,
  getGoalSheet,
} = require('../controllers/goalSheetController');

const router = express.Router();
router.use(protect);

router.post('/draft', authorizeRoles('employee', 'admin'), saveDraft);
router.post('/submit/:id', authorizeRoles('employee'), submitSheet);
router.post('/approve/:id', authorizeRoles('manager', 'admin'), approveSheet);
router.post('/reject/:id', authorizeRoles('manager', 'admin'), rejectSheet);
router.post('/return/:id', authorizeRoles('manager', 'admin'), returnForRework);
router.post('/unlock/:id', authorizeRoles('admin'), unlockSheet);
router.get('/:id', authorizeRoles('employee', 'manager', 'admin'), getGoalSheet);

module.exports = router;
