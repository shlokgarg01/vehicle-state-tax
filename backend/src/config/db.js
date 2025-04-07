import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Handle disconnection errors
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Reconnecting...");
  connectDB(); // Attempt to reconnect
});

// Handle connection errors
mongoose.connection.on("error", (err) => {
  console.error(`🚨 MongoDB error: ${err.message}`);
});

export default connectDB;
