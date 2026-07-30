const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationLink } = require('../utils/sendEmail');

const prisma = new PrismaClient();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. User Registration (Pending Approval & Unverified state)
const registerUser = async (req, res) => {
  try {
    let { email, fullName, password, role } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Sanitize Email and Password
    email = email.toLowerCase().trim();
    password = password.trim();

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (!fullName.match(/^[a-zA-Z ]+$/)) {
      return res.status(400).json({ message: "Name can only contain letters and spaces" });
    }

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User in DB
    const user = await prisma.user.create({
      data: {
        email,
        fullName: fullName.trim(),
        passwordHash: hashedPassword,
        role: role || 'CASHIER',
        isActive: false,   
        isVerified: false  
      }
    });

    return res.status(201).json({
      message: "Registration successful! Awaiting verification email.",
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

// 2. Admin Triggers Verification Email
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
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours Expiry

    console.log("Generated Token:", token);
    console.log("Saving for User ID:", numericUserId);

    await prisma.user.update({
      where: { id: numericUserId },
      data: {
        verificationToken: token,
        tokenExpiresAt: tokenExpiresAt
      }
    });

    await sendVerificationLink(user.email, token);

    return res.status(200).json({
      message: `Verification link sent successfully to ${user.email}`
    });

  } catch (error) {
    console.error("Send Link error:", error);
    return res.status(500).json({ message: "Failed to send verification email" });
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

// 4. User Login (Active & Verified Checks)
const LoginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    // Lowercase and trim for exact matching
    email = email.toLowerCase().trim();
    password = password.trim();

    const user = await prisma.user.findUnique({ where: { email } });
    
    // Debug Log (Terminal එකේ බලන්න user ව හොයාගත්තද කියලා)
    if (!user) {
      console.log(`Login Failed: User with email '${email}' not found.`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log(`Login Failed: Password incorrect for '${email}'.`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check Statuses
    if (!user.isVerified) {
      return res.status(403).json({ message: "Your email is not verified. Please check your inbox for the activation link." });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is deactivated. Contact admin." });
    }

    // Generate JWT Token
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

module.exports = { 
  registerUser, 
  sendVerificationEmail, 
  verifyEmailToken, 
  LoginUser,
  getPendingUsers
};