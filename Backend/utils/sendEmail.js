const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Send Account Verification Link Email
const sendVerificationLink = async (toEmail, token) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Bloom Café POS" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your Bloom Café Account ☕",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #0f172a; background-color: #ffffff;">
        <h2 style="color: #7c3aed; text-align: center; margin-bottom: 8px;">Bloom Café POS ☕</h2>
        <h3 style="text-align: center; color: #334155; margin-top: 0;">Verify Your Email Address</h3>
        
        <p style="font-size: 14px; color: #475569; line-height: 1.5;">Hello,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.5;">
          Your account registration request for Bloom Café POS has been initiated. Please click the button below to verify your email address and activate your account:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}" target="_blank" style="background-color: #7c3aed; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.3);">
            Verify & Activate Account
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; text-align: center;">Or copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #7c3aed; word-break: break-all; text-align: center; background-color: #f8fafc; padding: 8px; border-radius: 6px;">
          ${verificationUrl}
        </p>
        
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
          This link will expire in 24 hours. If you did not request this account, please ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// 2. Send Password Reset OTP Email
const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"Bloom Café POS" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset OTP - Bloom Café POS 🔐",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; color: #0f172a; background-color: #ffffff;">
        <h2 style="color: #7c3aed; text-align: center; margin-bottom: 8px;">Bloom Café POS ☕</h2>
        <h3 style="text-align: center; color: #334155; margin-top: 0; font-size: 16px;">Password Reset Security Code</h3>
        
        <p style="font-size: 14px; color: #475569; line-height: 1.5;">Hello,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.5;">
          We received a request to reset your password. Use the following 6-digit One-Time Password (OTP) to complete the verification:
        </p>
        
        <div style="background-color: #f3e8ff; border: 1px border-purple-200; text-align: center; padding: 20px; border-radius: 10px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #7c3aed; font-family: monospace;">${otp}</span>
        </div>

        <p style="font-size: 12px; color: #64748b; text-align: center; line-height: 1.4;">
          This OTP is valid for <strong>10 minutes</strong> only.<br/>
          If you did not request a password reset, please ignore this email or contact the admin immediately.
        </p>
        
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
        <p style="font-size: 10px; color: #94a3b8; text-align: center; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
          Bloom Café POS System • Automated Security Alert
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { 
  sendVerificationLink, 
  sendOtpEmail 
};