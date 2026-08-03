const { 
  registerUser, 
  LoginUser, 
  verifyEmailToken, 
  sendVerificationEmail, 
  getPendingUsers,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/authMiddleware');
const express = require('express');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', LoginUser);

router.get('/verify-email', verifyEmailToken);
router.get('/verify-email/:token', verifyEmailToken);

router.post('/send-verification/:userId', sendVerificationEmail); 
router.get('/pending-users', getPendingUsers);

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;