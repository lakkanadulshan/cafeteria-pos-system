const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// 🟢 FIX 1: Cleaned Single Import
const { sendVerificationLink, sendOtpEmail } = require('../utils/sendEmail');

const prisma = new PrismaClient();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Check if initial setup (Admin creation) is required
const getSetupStatus = async (req, res) => {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' },
    });
    return res.status(200).json({ isSetupRequired: adminCount === 0 });
  } catch (error) {
    console.error('Setup status check error:', error);
    return res.status(500).json({ message: 'Server error while checking setup status.' });
  }
};

// @desc    Create First Admin User
const initialSetup = async (req, res) => {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: 'Setup is already completed. An Admin account already exists.',
      });
    }

    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: 'All fields (fullName, email, password) are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        fullName: fullName.trim(),
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        isVerified: true,
      },
    });

    return res.status(201).json({
      message: 'Initial Admin account created successfully!',
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Initial setup error:', error);
    return res.status(500).json({ message: 'Server error during initial setup.' });
  }
};

// 1. User Registration
const registerUser = async (req, res) => {
  try {
    let { email, fullName, password, role } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    email = email.toLowerCase().trim();
    password = password.trim();

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Generate Token & Expiry Date
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        fullName: fullName.trim(),
        passwordHash: hashedPassword,
        role: role || 'CASHIER',
        isActive: false,   
        isVerified: false,
        verificationToken: token,       
        tokenExpiresAt: tokenExpiresAt  
      }
    });

    let verificationEmailSent = false;

    try {
      await sendVerificationLink(user.email, token);
      verificationEmailSent = true;
    } catch (mailError) {
      console.error("Auto Verification Email Dispatch Failed:", mailError);
    }

    return res.status(201).json({
      message: verificationEmailSent
        ? "Registration successful! Verification email has been sent."
        : "Registration successful, but the verification email could not be sent right now. Please contact admin or resend the link.",
      verificationEmailSent,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Admin Triggers Verification Email (Non-blocking Fix)
const sendVerificationEmail = async (req, res) => {
  try {
    const { userId } = req.params;
    const numericUserId = parseInt(userId, 10);

    if (isNaN(numericUserId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await prisma.user.findUnique({ 
      where: { id: numericUserId } 
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours

    // Save token in DB
    await prisma.user.update({
      where: { id: numericUserId },
      data: {
        verificationToken: token,
        tokenExpiresAt: tokenExpiresAt
      }
    });

    res.status(200).json({
      message: `Verification token generated! Dispatching email to ${user.email}...`,
      token
    });

    sendVerificationLink(user.email, token)
      .then(() => console.log(`Verification mail sent to ${user.email}`))
      .catch((err) => console.error("Background Mail Error:", err.message));

  } catch (error) {
    console.error("Send Link error:", error);
    return res.status(500).json({ message: "Failed to process verification link request" });
  }
};

// 3. Verify Email Token
const verifyEmailToken = async (req, res) => {
  try {
    const token = req.query.token || req.params.token;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    if (new Date() > new Date(user.tokenExpiresAt)) {
      return res.status(400).json({ message: "Verification link has expired. Please contact Admin." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        isActive: true,
        verificationToken: null,
        tokenExpiresAt: null
      }
    });

    return res.status(200).json({
      message: "Email verified and account activated successfully! You can now login.",
      user: {
        email: user.email,
        fullName: user.fullName
      }
    });

  } catch (error) {
    console.error("Verify Link error:", error);
    return res.status(500).json({ message: "Email verification failed" });
  }
};

// 4. User Login
const LoginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    email = email.toLowerCase().trim();
    password = password.trim();

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Your email is not verified. Please check your inbox for the activation link." });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is deactivated. Contact admin." });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get Pending Cashiers List
const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        isVerified: false,
        role: 'CASHIER'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        isVerified: true,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Fetch Pending Users error:", error);
    return res.status(500).json({ message: "Failed to fetch pending users" });
  }
};

// GET Profile Metrics
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const totalOrdersCount = user.orders.length;
    const totalSalesVolume = user.orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = user.orders.filter(order => new Date(order.createdAt) >= today);
    const todaySalesVolume = todayOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      stats: {
        totalOrdersCount,
        totalSalesVolume,
        todayOrdersCount: todayOrders.length,
        todaySalesVolume
      }
    });

  } catch (error) {
    console.error("Get Profile error:", error);
    return res.status(500).json({ message: "Failed to fetch profile metrics" });
  }
};

// UPDATE Profile Name
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    let { fullName } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "Full Name is required" });
    }

    fullName = fullName.trim();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { fullName },
      select: { id: true, email: true, fullName: true, role: true }
    });

    return res.status(200).json({
      message: "Profile details updated!",
      user: updatedUser
    });

  } catch (error) {
    console.error("Update Profile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// CHANGE Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    let { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    currentPassword = currentPassword.trim();
    newPassword = newPassword.trim();

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHashedPassword }
    });

    return res.status(200).json({
      message: "Password updated successfully!"
    });

  } catch (error) {
    console.error("Change Password error:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

// REQUEST OTP
const requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        resetOtp: otp,
        resetOtpExpiresAt: expiresAt,
      },
    });

    try {
      await sendOtpEmail(email, otp);
      res.json({ message: "OTP sent successfully to your email." });
    } catch (mailErr) {
      console.error("OTP Email Error:", mailErr.message);
      res.status(200).json({ message: "OTP generated successfully, but dispatch encountered network delays." });
    }

  } catch (error) {
    console.error("OTP Request Error:", error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

// VERIFY OTP
const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetOtp || !user.resetOtpExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired reset request." });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code." });
    }

    if (new Date() > new Date(user.resetOtpExpiresAt)) {
      return res.status(400).json({ message: "OTP has expired. Request a new one." });
    }

    res.json({ message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed." });
  }
};

// RESET PASSWORD WITH OTP
const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and New Password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code." });
    }

    if (!user.resetOtpExpiresAt || new Date() > new Date(user.resetOtpExpiresAt)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
        resetOtp: null,
        resetOtpExpiresAt: null,
      },
    });

    return res.status(200).json({ message: "Password reset successful! Please log in." });
  } catch (error) {
    console.error("CRITICAL RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Server error occurred while resetting password." });
  }
};

module.exports = { 
  registerUser, 
  sendVerificationEmail, 
  verifyEmailToken, 
  LoginUser,
  getPendingUsers,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordResetOtp,
  verifyResetOtp,
  resetPasswordWithOtp,
  getSetupStatus,
  initialSetup
};