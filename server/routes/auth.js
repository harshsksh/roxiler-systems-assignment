const express = require('express');
const router = express.Router();
const { register, login, getProfile, updatePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateUser, validatePasswordUpdate } = require('../middleware/validation');

router.post('/register', validateUser, register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/password', authenticateToken, validatePasswordUpdate, updatePassword);

module.exports = router;
