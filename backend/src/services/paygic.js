import axios from "axios";
import config from "../config/config.js";
import CONSTANTS from "../constants/constants.js";
import Constants from "../models/Constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

/** Paygic merchant token creation. */
const createPaymentGatewayToken = async () => {
  const url = config.payment.baseUrl + "/createMerchantToken";
  const response = await axios.post(
    url,
    {
      mid: config.payment.mid,
      password: config.payment.password,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  if (response.data.status) {
    return response?.data?.data?.token;
  }

  throw new ErrorHandler(
    response.data.msg || "Failed to create payment token",
    400
  );
};

/** @deprecated Paygic token cache (25-day refresh). */
const getValidToken = async () => {
  const TOKEN_KEY = "payment_gateway_token";
  let token = await Constants.findOne({ key: TOKEN_KEY });

  if (!token) {
    const newToken = await createPaymentGatewayToken();
    await Constants.create({ key: TOKEN_KEY, value: newToken });
    return newToken;
  }

  const now = new Date();
  const updatedAt = new Date(token.updatedAt);
  const daysOld = (now - updatedAt) / (1000 * 60 * 60 * 24);

  if (daysOld > 25) {
    const refreshedToken = await createPaymentGatewayToken();
    token.value = refreshedToken;
    await token.save();
    return refreshedToken;
  }

  return token.value;
};

/** Paygic payment page URL creation. */
const createPaymentLink = async (
  orderId,
  amount,
  mobileNumber,
  { backendUrl } = {}
) => {
  const token = await getValidToken();
  const url = config.payment.baseUrl + "/createPaymentPage";
  const publicBackendUrl = String(backendUrl || config.backendUrl).replace(
    /\/$/,
    ""
  );

  const response = await axios.post(
    url,
    {
      mid: config.payment.mid,
      merchantReferenceId: orderId,
      amount: amount,
      customer_mobile: mobileNumber,
      customer_name: mobileNumber,
      customer_email: mobileNumber,
      redirect_URL: `${publicBackendUrl}/api/v1/tax/paymentRedirect`,
      failed_URL: "",
    },
    { headers: { token } }
  );

  if (response.data.status) {
    return response.data.data.payPageUrl;
  }

  throw new ErrorHandler(
    response.data.msg || "Failed to create payment URL",
    404
  );
};

/** Paygic payment status check. */
const getPaymentStatus = async (orderId) => {
  const token = await getValidToken();
  const url = config.payment.baseUrl + "/checkPaymentStatus";

  const response = await axios.post(
    url,
    {
      mid: config.payment.mid,
      merchantReferenceId: orderId,
    },
    { headers: { "Content-Type": "application/json", token } }
  );

  if (response.data.status) {
    const transactionStatus = response.data.txnStatus;
    if (transactionStatus === CONSTANTS.PAYMENT.TRANSACTION_STATUS.SUCCESS) {
      return true;
    }
  }

  return false;
};

export default {
  createPaymentGatewayToken,
  createPaymentLink,
  getPaymentStatus,
};
