const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware'); 

// Create Category (ADMIN only)
router.post('/', authenticateToken, authorizeRoles('ADMIN'), categoryController.createCategory);

// Get All Categories (ADMIN & CASHIER)
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), categoryController.getAllCategories);

// Delete Category (ADMIN only)
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.deleteCategory);

module.exports = router;