const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Reports accessible ONLY by Admin
router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/daily-sales', reportController.getDailySales);
router.get('/top-items', reportController.getTopSellingItems);

module.exports = router;