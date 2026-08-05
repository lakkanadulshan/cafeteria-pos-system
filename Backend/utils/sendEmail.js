// Send Email Verification Link via Brevo HTTP API
const sendVerificationLink = async (toEmail, token) => {
  const clientUrl = process.env.CLIENT_URL || "https://cafeteria-pos-system-lac.vercel.app";
  const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { 
          name: "Bloom Café POS", 
          email: process.env.SENDER_EMAIL || process.env.EMAIL_USER 
        },
        to: [{ email: toEmail }],
        subject: "Verify Your Bloom Café Account ☕",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #6366f1;">Welcome to Bloom Café!</h2>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" style="background-color: #6366f1; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Verify Email</a>
          </div>
        `
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to dispatch email via Brevo API");
    }
    console.log(`[Brevo API] Verification email sent successfully to ${toEmail}`);
    return data;
  } catch (error) {
    console.error("[Brevo API Error]:", error.message);
    throw error;
  }
};

// Send Reset OTP via Brevo HTTP API
const sendOtpEmail = async (toEmail, otp) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { 
          name: "Bloom Café POS", 
          email: process.env.SENDER_EMAIL || process.env.EMAIL_USER 
        },
        to: [{ email: toEmail }],
        subject: "Password Reset OTP - Bloom Café 🔑",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #6366f1;">Password Reset Request</h2>
            <p>Your 6-digit OTP code is:</p>
            <h1 style="color: #6366f1; letter-spacing: 4px;">${otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
          </div>
        `
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to dispatch OTP via Brevo API");
    }
    console.log(`[Brevo API] OTP email sent successfully to ${toEmail}`);
    return data;
  } catch (error) {
    console.error("[Brevo API Error]:", error.message);
    throw error;
  }
};

module.exports = { sendVerificationLink, sendOtpEmail };