module.exports = {
  PORT: process.env.PORT || "4872",

  SERVER: {
    port: process.env.PORT || 4000,
    DB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME || shopData,
  },

  CORS_ORIGIN: process.env.CORS_ORIGIN,
};
