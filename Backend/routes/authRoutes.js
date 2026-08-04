const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  LoginUser, 
  verifyEmailToken, 
  sendVerificationEmail, 
  getPendingUsers,
  getProfile,
  updateProfile,
  changePassword,
  // 🟢 OTP Controller Functions
  requestPasswordResetOtp,
  verifyResetOtp,
  resetPasswordWithOtp,
  getSetupStatus, initialSetup
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/authMiddleware');

// Public Auth Routes
router.post('/register', registerUser);
router.post('/login', LoginUser);

// Email Verification Routes
router.get('/verify-email', verifyEmailToken);
router.get('/verify-email/:token', verifyEmailToken);
router.post('/send-verification/:userId', sendVerificationEmail); 
router.get('/pending-users', getPendingUsers);

//  Forgot Password (OTP) Routes
router.post('/forgot-password/request-otp', requestPasswordResetOtp);
router.post('/forgot-password/verify-otp', verifyResetOtp);
router.post('/forgot-password/reset-password', resetPasswordWithOtp);

// Protected Staff Profile Routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);


// Setup Status Route
router.get('/setup-status', getSetupStatus);
// Initial Setup Route
router.post('/initial-setup', initialSetup);

module.exports = router;