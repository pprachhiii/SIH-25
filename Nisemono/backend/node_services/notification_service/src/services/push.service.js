const admin = require("firebase-admin");
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = require("../utils/config");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY,
    }),
  });
}

async function sendPush({ deviceToken, title, body, data = {} }) {
  try {
    const message = {
      token: deviceToken,
      notification: { title, body },
      data,
    };
    const response = await admin.messaging().send(message);
    console.log("Push sent:", response);
    return response;
  } catch (err) {
    console.error("Push notification error:", err);
    throw err;
  }
}

module.exports = { sendPush };
