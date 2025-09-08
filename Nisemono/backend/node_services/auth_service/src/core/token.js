const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} = require("../../../shared/jwtConfig");

/**
 * Generate an access token with user id and role
 * @param {Object} user - { id, role }
 * @returns {String} JWT access token
 */
function generateAccessToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

/**
 * Generate a refresh token with user id
 * @param {Object} user - { id }
 * @returns {String} JWT refresh token
 */
function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/**
 * Verify a token (access or refresh)
 * @param {String} token
 * @param {String} type - 'access' or 'refresh'
 * @returns {Object} Decoded token payload
 */
function verifyToken(token, type = "access") {
  const secret = type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
  return jwt.verify(token, secret);
}

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };
