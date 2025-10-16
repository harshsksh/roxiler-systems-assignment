const express = require('express');
const router = express.Router();
const { submitRating, getUserRatings, deleteRating } = require('../controllers/ratingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

router.use(authenticateToken);
router.post('/', authorizeRoles('normal_user', 'store_owner'), validateRating, submitRating);
router.get('/my-ratings', authorizeRoles('normal_user', 'store_owner'), getUserRatings);
router.delete('/:id', authorizeRoles('normal_user', 'store_owner'), deleteRating);

module.exports = router;
