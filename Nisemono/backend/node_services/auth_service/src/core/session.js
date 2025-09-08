const redis = require("redis");

// Create Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Connect to Redis
client.connect().catch(console.error);

/**
 * Store active session in Redis
 * @param {String} token - refresh token
 * @param {String} userId - user ID
 * @param {Number} ttl - optional expiry in seconds
 */
async function storeSession(token, userId, ttl = 7 * 24 * 60 * 60) {
  // default 7 days
  await client.set(`session:${token}`, userId, { EX: ttl });
}

/**
 * Revoke a token by deleting it from Redis
 * @param {String} token
 */
async function revokeToken(token) {
  await client.del(`session:${token}`);
}

/**
 * Check if token is blacklisted / revoked
 * @param {String} token
 * @returns {Boolean} true if token is invalid
 */
async function isTokenBlacklisted(token) {
  const exists = await client.get(`session:${token}`);
  return !exists;
}

module.exports = { storeSession, revokeToken, isTokenBlacklisted };
