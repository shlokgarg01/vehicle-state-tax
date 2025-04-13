import axios from "axios";
import dotenv from "dotenv";
import { OTP_REGEX, INDIAN_PHONE_REGEX } from "./helpers/validators.js";
dotenv.config();

export const sendOTP = async (otp, contactNumber) => {
  try {
    if (!OTP_REGEX.test(otp)) {
      throw new Error("Invalid OTP format");
    }

    if (!INDIAN_PHONE_REGEX.test(contactNumber)) {
      throw new Error("Invalid Indian phone number format");
    }

    const url = new URL("http://sms.messageindia.in/v2/sendSMS");
    const params = {
      username: process.env.SMS_USERNAME,
      message: `Your OTP is ${otp}`,
      sendername: process.env.SMS_SENDERNAME,
      smstype: "trans",
      numbers: contactNumber,
      apikey: process.env.SMS_APIKEY,
    };

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await axios.get(url.toString());

    if (response.data && response.data.status === "success") {
      return true;
    } else {
      throw new Error(
        "Failed to send OTP: " + (response.data?.message || "Unknown error")
      );
    }
  } catch (error) {
    console.error("SMS sending error:", error.message);
    throw new Error("Failed to send OTP via SMS");
  }
};
