const express = require('express');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  createCycle,
  listCycles,
  getActiveCycle,
  updateCycle,
  deleteCycle,
  activateCycle,
  deactivateCycle,
} = require('../controllers/cycleController');

const router = express.Router();
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/', listCycles);
router.get('/active', getActiveCycle);
router.post('/', createCycle);
router.put('/:id', updateCycle);
router.delete('/:id', deleteCycle);
router.post('/activate/:id', activateCycle);
router.post('/deactivate/:id', deactivateCycle);

module.exports = router;
