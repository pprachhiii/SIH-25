module.exports = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "token_secret",

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "token_secret",

  ACCESS_TOKEN_EXPIRY: "15m",

  REFRESH_TOKEN_EXPIRY: "7d",
};
