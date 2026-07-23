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
    smsType: process.env.SMS_TYPE,
  },
  nodeEnv: process.env.NODE_ENV || "development",
  payment: {
    baseUrl: process.env.PAYMENT_URL,
    mid: process.env.PAYMENT_MID,
    password: process.env.PAYMENT_PASSWORD,
  },

  razorpay: {
    apiBaseUrl: process.env.RAZORPAY_API_BASE_URL || "https://api.razorpay.com/v1",
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },

  pay0: {
    apiBaseUrl: process.env.PAY0_API_BASE_URL || "https://api.pay0.shop/apiv1",
    userToken:
      process.env.PAY0_USER_TOKEN ||
      process.env.PAY0_API_KEY ||
      "",
    secretKey:
      process.env.PAY0_SECRET_KEY ||
      process.env.PAY0_SECRET ||
      "",
  },

  firebase: {
    bucketName: process.env.FIREBASE_STORAGE_BUCKET_NAME,
  },

  whatsapp: {
    baseUrl: process.env.WHATSAPP_API_URL,
    token: process.env.WHATSAPP_AUTH_TOKEN,
    waId: process.env.WHATSAPP_API_WAID
  },

  mail: {
    pass: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
    usersTo: process.env.MAILS_USERS_TO,
    bccUsersTo: process.env.BCC_MAILS_USERS_TO
  },

  upi: {
    merchantUpiId: process.env.BUSINESS_UPI_ID || "",
    payeeName: process.env.UPI_PAYEE_NAME || "Vehicle State Tax",
  },
};

export default config;
