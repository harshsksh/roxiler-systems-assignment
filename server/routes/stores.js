const express = require('express');
const router = express.Router();
const { 
  getAllStores, 
  getStoreById, 
  createStore, 
  updateStore, 
  deleteStore,
  getStoreRatings
} = require('../controllers/storeController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateStore } = require('../middleware/validation');

// Public routes (no authentication required)
router.get('/', getAllStores);
router.get('/:id', getStoreById);

// Protected routes
router.use(authenticateToken);

// Store management - only for system admin
router.post('/', authorizeRoles('system_admin'), validateStore, createStore);
router.put('/:id', authorizeRoles('system_admin'), validateStore, updateStore);
router.delete('/:id', authorizeRoles('system_admin'), deleteStore);

// Store ratings - for store owners
router.get('/:id/ratings', authorizeRoles('store_owner', 'system_admin'), getStoreRatings);

module.exports = router;
