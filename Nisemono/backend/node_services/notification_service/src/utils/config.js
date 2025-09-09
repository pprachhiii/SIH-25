require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "token_secret",

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "token_secret",

  ACCESS_TOKEN_EXPIRY: "15m",

  REFRESH_TOKEN_EXPIRY: "7d",

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};
