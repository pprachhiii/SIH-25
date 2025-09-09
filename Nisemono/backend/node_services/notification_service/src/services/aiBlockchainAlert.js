const { sendEmail } = require("./email.service");
const { sendSMS } = require("./sms.service");
const { sendPush } = require("./push.service");

async function handleAlert({ type, channel, payload }) {
  console.log(`Received ${type} event, sending via ${channel}`);

  try {
    let result;

    switch (channel) {
      case "email":
        result = await sendEmail(payload);
        break;
      case "sms":
        result = await sendSMS(payload);
        break;
      case "push":
        result = await sendPush(payload);
        break;
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }

    console.log(
      `Notification sent successfully: ${
        result?.messageId || result?.sid || result
      }`
    );
    return result;
  } catch (err) {
    console.error(`Error sending notification for ${type} event:`, err);
    throw err;
  }
}

module.exports = { handleAlert };
