const {
  sendEmail,
} = require("../../../notification_service/src/services/email.service");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(to, otp) {
  const subject = "Your One-Time Password (OTP)";

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto;">
    <h2 style="color: #2c3e50; text-align: center;">Your One-Time Password (OTP)</h2>
    <p>Hello,</p>
    <p>Your One-Time Password (OTP) for authentication is:</p>
    <div style="margin: 20px 0; padding: 15px; background: #f4f6f8; border-radius: 8px; text-align: center;">
      <span style="font-size: 28px; font-weight: bold; color: #2c3e50;">${otp}</span>
    </div>
    <p>This code is valid for <strong>5 minutes</strong>.</p>
    <p style="color: #e74c3c; font-weight: bold;">⚠ Do not share this code with anyone.</p>
    <p>If you did not request this, you can safely ignore this email.</p>
    <br/>
    <p style="font-size: 14px; color: #7f8c8d; text-align: center;">
      Thanks,<br/>The Nisemono Team
    </p>
  </div>
  `;

  return await sendEmail(to, subject, html);
}

module.exports = { generateOTP, sendOtpEmail };
