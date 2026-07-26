const { registerUser,LoginUser} = require('../controllers/authController');
const express = require('express');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', LoginUser);

module.exports = router;