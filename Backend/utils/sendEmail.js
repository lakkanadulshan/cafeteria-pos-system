const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

module.exports = { sendVerificationLink };