const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware'); 

router.post('/', authenticateToken, authorizeRoles('ADMIN'), categoryController.createCategory);

router.get('/', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), categoryController.getAllCategories);
module.exports = router;