import dotenv from "dotenv";
dotenv.config();

const config = {
  backendUrl: process.env.BACKEND_URL,
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  cors_origin: process.env.CORS_ORIGIN,
  JWT: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },
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
  },

  firebase: {
    bucketName: process.env.FIREBASE_STORAGE_BUCKET_NAME,
  },
};

export default config;
