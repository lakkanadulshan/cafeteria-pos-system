const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// 1. GET ALL MENU ITEMS 
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), menuController.getAllMenuItems);

// 2. GET SINGLE MENU ITEM BY ID
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), menuController.getMenuItemById);

// 3. CREATE MENU ITEM (Admin Only)
router.post('/', authenticateToken, authorizeRoles('ADMIN'), menuController.createMenuItem);

// 4. UPDATE MENU ITEM (Admin Only)
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), menuController.updateMenuItem);

// 5. DELETE MENU ITEM (Admin Only)
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), menuController.deleteMenuItem);

module.exports = router;