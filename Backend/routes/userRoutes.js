const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);
router.patch('/:id/status', userController.updateUserStatus);

module.exports = router;