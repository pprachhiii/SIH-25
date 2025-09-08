const express = require("express");
const router = express.Router();
const {
  sendEmailNotification,
  sendSMSNotification,
  sendPushNotification,
} = require("../controllers/notification.controller");

router.post("/email", sendEmailNotification);

router.post("/sms", sendSMSNotification);

router.post("/push", sendPushNotification);

module.exports = router;
