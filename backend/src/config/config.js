import dotenv from "dotenv";
dotenv.config();

const config = {
  backendUrl: process.env.BACKEND_URL,
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE,
  cors_origin: process.env.CORS_ORIGIN,
  sms: {
    username: process.env.SMS_USERNAME,
    senderName: process.env.SMS_SENDER_NAME,
    apiKey: process.env.SMS_API_KEY,
  },
  nodeEnv: process.env.NODE_ENV || "development",
  payment: {
    baseUrl: process.env.PAYMENT_URL,
    mid: process.env.PAYMENT_MID,
    password: process.env.PAYMENT_PASSWORD,
  }
};

export default config;
