const { 
  registerUser, 
  LoginUser, 
  verifyEmailToken, 
  sendVerificationEmail, 
  getPendingUsers 
} = require('../controllers/authController');
const express = require('express');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', LoginUser);

router.get('/verify-email', verifyEmailToken);
router.get('/verify-email/:token', verifyEmailToken);

router.post('/send-verification/:userId', sendVerificationEmail); 
router.get('/pending-users', getPendingUsers);

module.exports = router;