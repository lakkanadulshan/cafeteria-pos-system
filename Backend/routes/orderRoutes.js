const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), orderController.createOrder);
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), orderController.getAllOrders);
router.get('/:id', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), orderController.getOrderById);

// Status Update (e.g. Cancel order)
router.patch('/:id/status', authenticateToken, authorizeRoles('ADMIN', 'CASHIER'), orderController.updateOrderStatus);

module.exports = router;