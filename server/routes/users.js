const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  getDashboardStats 
} = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');

router.use(authenticateToken);

router.get('/dashboard/stats', authorizeRoles('system_admin'), getDashboardStats);
router.get('/', authorizeRoles('system_admin'), getAllUsers);
router.get('/:id', authorizeRoles('system_admin'), getUserById);
router.post('/', authorizeRoles('system_admin'), validateUser, createUser);
router.put('/:id', authorizeRoles('system_admin'), validateUser, updateUser);
router.delete('/:id', authorizeRoles('system_admin'), deleteUser);

module.exports = router;
