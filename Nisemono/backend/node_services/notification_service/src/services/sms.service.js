const twilio = require("twilio");
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = require("../utils/config");

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function validateE164(number) {
  const regex = /^\+[1-9]\d{1,14}$/;
  return regex.test(number);
}

async function sendSMS({ to, message }) {
  try {
    if (!TWILIO_PHONE_NUMBER) {
      throw new Error("TWILIO_PHONE_NUMBER is not configured in .env");
    }

    if (!validateE164(to)) {
      throw new Error(`Recipient number ${to} is not in valid E.164 format`);
    }

    console.log(`Sending SMS from ${TWILIO_PHONE_NUMBER} to ${to}`);

    const msg = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to,
    });

    console.log(`SMS sent successfully: ${msg.sid}`);
    return msg;
  } catch (err) {
    console.error("SMS sending error:", err.message || err);
    throw err;
  }
}

module.exports = { sendSMS };
