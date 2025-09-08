const { sendEmail } = require("../services/email.service");
const { sendSMS } = require("../services/sms.service");
const { sendPush } = require("../services/push.service");

async function sendEmailNotification(req, res) {
  const { to, subject, text, html } = req.body;
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await sendEmail({ to, subject, text, html });
    res.status(200).json({ success: true, messageId: result.messageId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function sendSMSNotification(req, res) {
  const { to, message, channel } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await sendSMS({ to, message, channel });
    res.status(200).json({ success: true, sid: result.sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function sendPushNotification(req, res) {
  const { deviceToken, title, body, data } = req.body;
  if (!deviceToken || !title || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await sendPush({ deviceToken, title, body, data });
    res.status(200).json({ success: true, responseId: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  sendEmailNotification,
  sendSMSNotification,
  sendPushNotification,
};
