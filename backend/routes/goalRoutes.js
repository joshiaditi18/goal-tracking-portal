const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const { createGoal, updateGoal, submitGoal, lockGoal } = require('../controllers/goalController');

const router = express.Router();

router.use(protect);
router.post('/', authorizeRoles('employee', 'manager', 'admin'), createGoal);
router.put('/:id', authorizeRoles('employee'), updateGoal);
router.post('/submit/:sheetId', authorizeRoles('employee'), submitGoal);
router.post('/lock/:id', authorizeRoles('admin', 'manager'), lockGoal);

module.exports = router;
