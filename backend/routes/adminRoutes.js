const express = require('express');
const { createUser, listUsers, getUserById, updateUser, deleteUser } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

router.post('/users', createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
