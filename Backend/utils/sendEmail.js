const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Email Verification Link යවන Function එක
const sendVerificationLink = async (toEmail, token) => {
  const clientUrl = process.env.CLIENT_URL || "https://cafeteria-pos-system-lac.vercel.app";
  const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Bloom Café POS" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your Bloom Café Account ☕",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Bloom Café!</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">Verify Email</a>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// 2. Password Reset OTP Code එක යවන Function එක
const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Bloom Café POS" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset OTP - Bloom Café 🔑",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Your 6-digit OTP code is:</p>
        <h1 style="color: #6366f1; letter-spacing: 4px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationLink, sendOtpEmail };