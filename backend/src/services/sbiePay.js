import { createRequire } from "module";
import config from "../config/config.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

const require = createRequire(import.meta.url);
const { SBIEPayClient } = require("epay_nodejs_sdk");

const normalizeMobile = (mobileNumber) =>
  String(mobileNumber).replace(/\D/g, "").slice(-10);

const getCredentials = () => {
  const { apiKey, apiSecret, encryptionKey } = config.sbiePay;
  if (!apiKey || !apiSecret || !encryptionKey) {
    throw new ErrorHandler("SBIePay credentials are not configured", 500);
  }
  return { apiKey, apiSecret, encryptionKey };
};

const getEnvironment = () => {
  const env = String(config.sbiePay.environment || "SANDBOX").toUpperCase();
  return env === "LIVE" ? "LIVE" : "SANDBOX";
};

const getApiBaseUrl = () => {
  const host = config.sbiePay.baseUrl;
  const path = config.sbiePay.apiPath || "/api/transaction/v1";
  return `${String(host).replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
};

let cachedClient = null;

const getClient = () => {
  if (cachedClient) return cachedClient;

  cachedClient = new SBIEPayClient(
    getCredentials(),
    getEnvironment(),
    Boolean(config.sbiePay.logging),
    "JSON"
  );

  if (cachedClient.apiClient?.defaults) {
    cachedClient.apiClient.defaults.baseURL = getApiBaseUrl();
    const referrer = String(config.backendUrl).replace(/\/$/, "");
    cachedClient.apiClient.defaults.headers.common["x-referrer"] = referrer;
  }

  return cachedClient;
};

/** SBIePay SDK handles auth internally — no separate token step. */
const createPaymentGatewayToken = async () => null;

const unwrapOrder = (response) => {
  const raw = response?.data?.[0];
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return raw;
};

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

  const orderAmount = Number(amount);
  if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
    throw new ErrorHandler("Invalid payment amount for SBIePay", 400);
  }

  const orderRefNumber = String(orderId).slice(0, 50);
  const returnUrl = `${publicBackendUrl}/api/v1/tax/paymentRedirect?order_id=${encodeURIComponent(orderId)}`;

  const orderDetails = {
    currencyCode: config.sbiePay.currencyCode || "INR",
    orderAmount,
    orderRefNumber,
    returnUrl,
    otherDetails: JSON.stringify({
      source: "vehicle_state_tax",
      mobile: normalizeMobile(mobileNumber),
    }),
  };

  if (config.sbiePay.merchantId) {
    orderDetails.mId = String(config.sbiePay.merchantId).slice(0, 7);
  }

  const client = getClient();
  let response;
  try {
    response = await client.order.create(orderDetails);
  } catch (err) {
    const message =
      err?.data?.errors?.[0]?.errorMessage ||
      err?.message ||
      "Failed to create SBIePay order";
    throw new ErrorHandler(message, 400);
  }

  if (response?.status && response.status >= 400) {
    throw new ErrorHandler(
      response?.errors?.[0]?.errorMessage || "SBIePay order creation failed",
      400
    );
  }

  const order = unwrapOrder(response);
  const paymentUrl = order?.transactionUrl;
  if (!paymentUrl) {
    throw new ErrorHandler("SBIePay did not return a payment URL", 502);
  }

  return paymentUrl;
};

const getPaymentStatus = async (orderId, amount) => {
  const client = getClient();
  const orderRefNumber = String(orderId).slice(0, 50);

  try {
    const searchPayload = { orderRefNumber };
    const orderAmount = Number(amount);
    if (Number.isFinite(orderAmount) && orderAmount > 0) {
      searchPayload.orderAmount = orderAmount;
    }
    const response = await client.order.search(searchPayload);
    const order = unwrapOrder(response);
    if (!order) return false;

    const status = order[0]?.orderInfo?.orderStatus
    return status === "PAID";
  } catch {
    return false;
  }
};

export default {
  createPaymentGatewayToken,
  createPaymentLink,
  getPaymentStatus,
};
