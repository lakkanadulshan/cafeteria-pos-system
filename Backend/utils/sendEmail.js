const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

module.exports = { sendVerificationLink };