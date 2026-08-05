const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Send Account Verification Link Email
const sendVerificationLink = async (toEmail, token) => {
  const clientUrl = process.env.CLIENT_URL || "https://cafeteria-pos-system-lac.vercel.app";
  const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Bloom Café POS <onboarding@resend.dev>",
    to: [toEmail],
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
          <a href="${verificationUrl}" target="_blank" style="background-color: #7c3aed; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
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
  });

  if (error) {
    console.error("Resend API Error details:", error);
    throw new Error(error.message);
  }

  return data;
};