const { login, refreshToken, logout } = require("../core/auth");
const { getUserFromDB } = require("../core/db");

async function loginController(req, res) {
  try {
    const { email, username, password, otp } = req.body;
    console.log("[Login] Incoming request:", {
      email,
      username,
      password,
      otp,
    });

    const user = await getUserFromDB(email || username);
    if (!user) {
      console.log("[Login] User not found:", email || username);
      throw new Error("User not found");
    }

    console.log("[Login] User found:", {
      id: user.id,
      requiresOtp: user.requiresOtp,
    });

    const result = await login(user, password, otp);
    console.log("[Login] Result:", result);

    if (result.message)
      return res.status(200).json({ message: result.message });

    res.status(200).json(result);
  } catch (err) {
    console.error("[Login] Error:", err.message);
    res.status(401).json({ error: err.message });
  }
}

async function refreshController(req, res) {
  try {
    const { refreshToken: token } = req.body;
    console.log("[Refresh] Incoming token:", token);

    const tokens = await refreshToken(token);
    console.log("[Refresh] New tokens:", tokens);

    res.status(200).json(tokens);
  } catch (err) {
    console.error("[Refresh] Error:", err.message);
    res.status(401).json({ error: err.message });
  }
}

async function logoutController(req, res) {
  try {
    const { refreshToken: token } = req.body;
    console.log("[Logout] Incoming token:", token);

    await logout(token);
    console.log("[Logout] Logout successful");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("[Logout] Error:", err.message);
    res.status(400).json({ error: err.message });
  }
}

module.exports = { loginController, refreshController, logoutController };
