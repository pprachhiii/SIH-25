const { generateAccessToken, generateRefreshToken } = require("./token");
const { storeSession, isTokenBlacklisted, revokeToken } = require("./session");
const { comparePassword } = require("../utils/passwordHash");
const { generateOTP, sendOtpEmail } = require("../utils/otp");
const client = require("../../../notification_service/src/utils/redisClient");

async function login(user, password, otpInput) {
  console.log("[Login] Starting login for user:", user.email);

  if (!user) {
    console.log("[Login] No user found");
    throw new Error("User not found");
  }

  const validPassword = await comparePassword(password, user.passwordHash);
  console.log("[Login] Password valid?", validPassword);

  if (!validPassword) {
    console.log("[Login] Invalid credentials for user:", user.email);
    throw new Error("Invalid credentials");
  }

  if (user.requiresOtp) {
    console.log("[Login] User requires OTP");
    if (!otpInput) {
      const otp = generateOTP();
      console.log("[Login] Generated OTP:", otp);
      await sendOtpEmail(user.email, otp);
      await storeSession(`otp:${otp}`, user.id, 5 * 60);
      console.log("[Login] OTP stored in Redis");
      return { message: "OTP sent to your email" };
    } else {
      console.log("[Login] Verifying provided OTP:", otpInput);
      const storedUserId = await client.get(`session:otp:${otpInput}`);
      console.log("[Login] OTP stored user ID:", storedUserId);
      if (!storedUserId || storedUserId !== user.id) {
        console.log("[Login] Invalid or expired OTP");
        throw new Error("Invalid or expired OTP");
      }
      await revokeToken(`otp:${otpInput}`);
      console.log("[Login] OTP revoked after successful verification");
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await storeSession(refreshToken, user.id);
  console.log("[Login] Access and refresh tokens generated and stored");

  return { accessToken, refreshToken };
}

async function refreshToken(refreshToken) {
  console.log("[RefreshToken] Starting refresh for token:", refreshToken);
  if (!refreshToken) throw new Error("Refresh token required");

  const blacklisted = await isTokenBlacklisted(refreshToken);
  console.log("[RefreshToken] Is blacklisted?", blacklisted);
  if (blacklisted) throw new Error("Refresh token revoked or invalid");

  const jwt = require("jsonwebtoken");
  const {
    REFRESH_TOKEN_SECRET,
  } = require("../../../notification_service/src/utils/config");

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    console.log("[RefreshToken] Token payload:", payload);
  } catch {
    console.log("[RefreshToken] Invalid refresh token");
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateAccessToken({
    id: payload.id,
    role: payload.role || "User",
  });
  const newRefreshToken = generateRefreshToken({ id: payload.id });

  await storeSession(newRefreshToken, payload.id);
  console.log("[RefreshToken] New tokens stored");

  return { accessToken, refreshToken: newRefreshToken };
}

async function logout(refreshToken) {
  console.log("[Logout] Logging out token:", refreshToken);
  if (!refreshToken) return;
  await revokeToken(refreshToken);
  console.log("[Logout] Token revoked successfully");
}

module.exports = { login, refreshToken, logout };
