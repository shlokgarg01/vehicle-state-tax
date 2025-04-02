import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Send OTP via MessageIndia SMS Gateway
 * @param {string} otp - The 6-digit OTP to send
 * @param {string} contactNumber - Recipient's phone number (without country code)
 * @returns {Promise<boolean>} - Returns true if SMS was sent successfully
 */
export const sendOTP = async (otp, contactNumber) => {
  try {
    // Validate inputs
    if (!/^\d{6}$/.test(otp)) {
      throw new Error("Invalid OTP format");
    }

    if (!/^[1-9][0-9]{9}$/.test(contactNumber)) {
      throw new Error("Invalid Indian phone number format");
    }

    // Construct the SMS URL
    const url = new URL("http://sms.messageindia.in/v2/sendSMS");
    const params = {
      username: process.env.SMS_USERNAME,
      message: `Your OTP is ${otp}`,
      sendername: process.env.SMS_SENDERNAME,
      smstype: "trans",
      numbers: contactNumber,
      apikey: process.env.SMS_APIKEY,
    };

    // Add parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Send the SMS
    const response = await axios.get(url.toString());

    // Check response (adapt based on MessageIndia's actual response format)
    if (response.data && response.data.status === "success") {
      console.log(`OTP sent to ${contactNumber}`);
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
