const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const upload = require('../middleware/upload'); 

// Routes
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), menuController.getAllMenuItems);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), menuController.getMenuItemById);

// Add Product - Upload single image to Cloudinary
router.post('/', authenticateToken, authorizeRoles('ADMIN'), upload.single('image'), menuController.createMenuItem);

// Update Product
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), upload.single('image'), menuController.updateMenuItem);

// Delete Product
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), menuController.deleteMenuItem);

module.exports = router;