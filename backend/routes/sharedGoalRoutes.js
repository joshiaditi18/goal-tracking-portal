const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  createSharedGoal,
  updateSharedWeightage,
  syncSharedAchievement,
  getSharedGoals,
} = require('../controllers/sharedGoalController');

const router = express.Router();
router.use(protect);

router.post('/', authorizeRoles('manager', 'admin'), createSharedGoal);
router.put('/weight/:id', authorizeRoles('employee', 'manager', 'admin'), updateSharedWeightage);
router.post('/sync/:id', authorizeRoles('manager', 'admin'), syncSharedAchievement);
router.get('/', authorizeRoles('employee', 'manager', 'admin'), getSharedGoals);

module.exports = router;
