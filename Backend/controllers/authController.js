const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Email format එක check කරන regex pattern එක
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User Registration 
const registerUser = async (req, res) => {
  try {
    const { email, fullName, password, role } = req.body;

    // 1. Basic Validation
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Email format validation
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (!fullName.match(/^[a-zA-Z ]+$/)) {
      return res.status(400).json({ message: "Name can only contain letters and spaces" });
    }

    // 2. Check if Email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 3. Hash the Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User in Database
    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash: hashedPassword,
        role: role || 'CASHIER',
        isActive: true
      }
    });

    // 5. Generate JWT Token with Role included
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 6. Success Response
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// User Login
const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    // 2. Find User by Email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is deactivated. Contact admin." });
    }

    // 4. Compare Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 5. Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 6. Response
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

module.exports = { registerUser, LoginUser };