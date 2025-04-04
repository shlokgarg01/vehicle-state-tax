// config/config.js
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },
  nodeEnv: process.env.NODE_ENV || "development",
};
export default config;
