/**
 * JWT Configuration
 * Used by all services for generating and verifying tokens
 */

module.exports = {
  // Secret for signing Access Tokens
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "token_secret",

  // Secret for signing Refresh Tokens
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "token_secret",

  // Expiration time for Access Tokens
  ACCESS_TOKEN_EXPIRY: "15m",

  // Expiration time for Refresh Tokens
  REFRESH_TOKEN_EXPIRY: "7d",
};
