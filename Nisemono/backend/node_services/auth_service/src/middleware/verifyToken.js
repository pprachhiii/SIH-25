const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
} = require("../../../notification_service/src/utils/config");

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = verifyToken;
