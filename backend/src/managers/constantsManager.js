import config from "../config/config.js";
import Constants from "../models/Constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import axios from 'axios';

class ConstantsManager {
  constructor() {}

  static createPaymentGatewayToken = async () => {
    const url = config.payment.baseUrl + "/createMerchantToken";
    let response = await axios.post(
      url,
      {
        mid: config.payment.mid,
        password: config.payment.password,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.status) {
      return response?.data?.data?.token;
    } else {
      throw new ErrorHandler(response.data.msg || "Failed to create payment token", 400);
    }
  };

  static getValidPaymentGatewayToken = async () => {
    const TOKEN_KEY = "payment_gateway_token";
    let token = await Constants.findOne({ key: TOKEN_KEY });

    if (!token) {
      const newToken = await this.createPaymentGatewayToken();
      token = await Constants.create({
        key: TOKEN_KEY,
        value: newToken,
      });
      return newToken;
    }

    const now = new Date();
    const updatedAt = new Date(token.updatedAt);
    const daysOld = (now - updatedAt) / (1000 * 60 * 60 * 24);

    // token expires after 30 days. So updating it if it's 25 days older.
    if (daysOld > 25) {
      const refreshedToken = await this.createPaymentGatewayToken();
      token.value = refreshedToken;
      await token.save();
      return refreshedToken;
    }
    return token.value;
  };
}

export default ConstantsManager;
