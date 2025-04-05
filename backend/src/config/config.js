import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE,
  cors_origin: process.env.CORS_ORIGIN,
  sms: {
    username: process.env.SMS_USERNAME,
    sendername: process.env.SMS_SENDERNAME,
    apikey: process.env.SMS_APIKEY,
  },
  nodeEnv: process.env.NODE_ENV || "development",
};

export default config;
