const express = require('express');
const { loginUser, getCurrentUser, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getCurrentUser);

module.exports = router;
