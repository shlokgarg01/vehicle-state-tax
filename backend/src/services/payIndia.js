import axios from "axios";
import config from "../config/config.js";
import CONSTANTS from "../constants/constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

const normalizeMobile = (mobileNumber) =>
  String(mobileNumber).replace(/\D/g, "").slice(-10);

const getApiToken = () => {
  const token = config.payIndia.apiToken;
  return token;
};

const apiHeaders = () => ({
  "Content-Type": "application/json",
  "X-Api-Token": getApiToken(),
});

const createPaymentGatewayToken = async () => null;

const createPaymentLink = async (
  orderId,
  amount,
  mobileNumber,
  { backendUrl } = {}
) => {
  const publicBackendUrl = String(backendUrl || config.backendUrl).replace(
    /\/$/,
    ""
  );

  const response = await axios.post(
    `${config.payIndia.apiBaseUrl}/create-order`,
    {
      user_token: getApiToken(),
      amount: Number(amount),
      order_id: orderId,
      redirect_url: `${publicBackendUrl}/api/v1/tax/paymentRedirect?order_id=${encodeURIComponent(orderId)}`,
      customer_mobile: normalizeMobile(mobileNumber),
      remark1: "Vehicle State Tax",
      remark2: orderId,
      description: "Vehicle State Tax",
    },
    { headers: apiHeaders() }
  );

  const data = response.data;

  if (!data?.status) {
    throw new ErrorHandler(
      data?.message || "Failed to create PayIndia payment link",
      400
    );
  }

  const paymentUrl = data.payment_url;
  if (!paymentUrl) {
    throw new ErrorHandler("PayIndia did not return a payment URL", 502);
  }

  return paymentUrl;
};

const getPaymentStatus = async (orderId) => {
  const response = await axios.get(
    `${config.payIndia.apiBaseUrl}/order-status`,
    {
      params: {
        user_token: getApiToken(),
        order_id: orderId,
      },
      headers: apiHeaders(),
    }
  );

  const data = response.data;
  if (!data?.status) {
    return false;
  }

  const paymentStatus = String(
    data.payment_status || data.paymentStatus || ""
  ).toUpperCase();

  return paymentStatus === CONSTANTS.PAYMENT.TRANSACTION_STATUS.SUCCESS;
};

export default {
  createPaymentGatewayToken,
  createPaymentLink,
  getPaymentStatus,
};
