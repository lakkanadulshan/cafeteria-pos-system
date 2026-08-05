const nodemailer = require('nodemailer');

let resendClient = null;
try {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
} catch (e) {
  // ignore if package not available or key not set
}

// Build a sensible SMTP transporter (works with Gmail app passwords)
const buildTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465;
  const secure = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Allow self-signed certificates if explicitly requested (not recommended for production)
      rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== 'false',
    },
  });
};

const transporter = buildTransporter();
if (transporter) {
  transporter.verify((err) => {
    if (err) console.warn('Mail transporter verify failed:', err.message || err);
  });
}

const sendViaResend = async (from, to, subject, html) => {
  if (!resendClient) throw new Error('Resend client not configured');
  return await resendClient.emails.send({
    from,
    to,
    subject,
    html,
  });
};

const sendViaNodemailer = async (mailOptions, timeout = 8000) => {
  if (!transporter) throw new Error('SMTP transporter not configured');
  return Promise.race([
    transporter.sendMail(mailOptions),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Email send timeout')), timeout)),
  ]);
};

// Helper to choose provider
const sendEmail = async ({ from, to, subject, html }) => {
  // Prefer Resend if available
  if (resendClient) {
    try {
      return await sendViaResend(from, to, subject, html);
    } catch (err) {
      console.warn('Resend send failed, falling back to SMTP:', err.message || err);
      // fall through to SMTP
    }
  }

  // Fallback to nodemailer SMTP
  return await sendViaNodemailer({ from, to, subject, html });
};

// 1. Email Verification Link යවන Function එක
const sendVerificationLink = async (toEmail, token) => {
  const clientUrl = process.env.CLIENT_URL || 'https://cafeteria-pos-system-lac.vercel.app';
  const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

  const fromAddress = process.env.EMAIL_FROM || `Bloom Café POS <${process.env.EMAIL_USER || 'no-reply@example.com'}>`;
  const subject = 'Verify Your Bloom Café Account ☕';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to Bloom Café!</h2>
      <p>Please click the button below to verify your email address:</p>
      <a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">Verify Email</a>
    </div>
  `;

  return await sendEmail({ from: fromAddress, to: toEmail, subject, html });
};

// 2. Password Reset OTP Code එක යවන Function එක
const sendOtpEmail = async (toEmail, otp) => {
  const fromAddress = process.env.EMAIL_FROM || `Bloom Café POS <${process.env.EMAIL_USER || 'no-reply@example.com'}>`;
  const subject = 'Password Reset OTP - Bloom Café 🔑';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>Your 6-digit OTP code is:</p>
      <h1 style="color: #6366f1; letter-spacing: 4px;">${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    </div>
  `;

  return await sendEmail({ from: fromAddress, to: toEmail, subject, html });
};

module.exports = { sendVerificationLink, sendOtpEmail };