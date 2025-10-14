const express = require('express');
const router = express.Router();
const { submitRating, getUserRatings, deleteRating } = require('../controllers/ratingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Rating management - for normal users and store owners
router.post('/', authorizeRoles('normal_user', 'store_owner'), validateRating, submitRating);
router.get('/my-ratings', authorizeRoles('normal_user', 'store_owner'), getUserRatings);
router.delete('/:id', authorizeRoles('normal_user', 'store_owner'), deleteRating);

module.exports = router;
