const client = require("./redisClient");

async function storeSession(token, userId, ttl = 7 * 24 * 60 * 60) {
  await client.set(`session:${token}`, userId, { EX: ttl });
}

async function revokeToken(token) {
  await client.del(`session:${token}`);
}

async function isTokenBlacklisted(token) {
  const exists = await client.get(`session:${token}`);
  return !exists;
}

module.exports = { storeSession, revokeToken, isTokenBlacklisted };
