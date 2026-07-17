import Constants from "../models/Constants.js";
import { getPaymentGateway } from "../services/paymentGateway.js";

class ConstantsManager {
  constructor() {}

  static createPaymentGatewayToken = async () => {
    const gateway = await getPaymentGateway();
    return gateway.createPaymentGatewayToken();
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

  static getConstantValue = async (key, defaultValue = "") => {
    const constant = await Constants.findOne({ key });
    if (!constant || constant.value === undefined || constant.value === null) {
      return defaultValue;
    }
    return String(constant.value);
  };

  static getNumericConstant = async (key, defaultValue = 0) => {
    const constant = await Constants.findOne({ key });
    if (!constant || constant.value === undefined || constant.value === null) {
      return defaultValue;
    }

    const parsed = Number(String(constant.value).trim());
    return Number.isFinite(parsed) ? parsed : defaultValue;
  };

  static getBooleanConstant = async (key, defaultValue = false) => {
    const constant = await Constants.findOne({ key });
    if (!constant || constant.value === undefined || constant.value === null) {
      return defaultValue;
    }

    const val = String(constant.value).trim().toLowerCase();
    if (["true", "1", "yes", "y", "on"].includes(val)) return true;
    if (["false", "0", "no", "n", "off"].includes(val)) return false;

    return defaultValue;
  };
}

export default ConstantsManager;
