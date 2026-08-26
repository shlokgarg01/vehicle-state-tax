import crypto from "crypto";
import axios from "axios";
import config from "../config/config.js";
import CONSTANTS from "../constants/constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

const normalizeMobile = (mobileNumber) =>
  String(mobileNumber).replace(/\D/g, "").slice(-10);

const getPay0Credentials = (isTesting = false) => {
  const isTest = isTesting === true || String(isTesting).toLowerCase() === "true";
  if (isTest) {
    return {
      apiBaseUrl: config.payVST.apiBaseUrl,
      userToken: config.payVST.userToken,
      secretKey: config.payVST.secretKey,
    };
  }
  return {
    apiBaseUrl: config.pay0.apiBaseUrl,
    userToken: config.pay0.userToken,
    secretKey: config.pay0.secretKey,
  };
};

const getUserToken = (isTesting = false) => {
  const creds = getPay0Credentials(isTesting);
  if (!creds.userToken) {
    throw new ErrorHandler("Pay0 user token is not configured", 500);
  }
  return creds.userToken;
};

const postForm = async (path, fields, isTesting = false) => {
  const creds = getPay0Credentials(isTesting);
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      body.append(key, String(value));
    }
  });

  const response = await axios.post(`${creds.apiBaseUrl}${path}`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
};

/** Pay0 does not use a separate token endpoint — API key is sent per request. */
const createPaymentGatewayToken = async () => null;

const createPaymentLink = async (
  orderId,
  amount,
  mobileNumber,
  { backendUrl, isTesting = false } = {}
) => {
  const publicBackendUrl = String(backendUrl || config.backendUrl).replace(
    /\/$/,
    ""
  );

  const data = await postForm(
    "/create-order",
    {
      customer_mobile: normalizeMobile(mobileNumber),
      customer_name: normalizeMobile(mobileNumber) || "Customer",
      user_token: getUserToken(isTesting),
      amount: Number(amount),
      order_id: orderId,
      redirect_url: `${publicBackendUrl}/api/v1/tax/paymentRedirect?order_id=${encodeURIComponent(orderId)}`,
      remark1: "Vehicle State Tax",
      remark2: orderId,
    },
    isTesting
  );

  if (!data?.status) {
    throw new ErrorHandler(
      data?.message || "Failed to create Pay0 payment link",
      400
    );
  }

  const paymentUrl = data?.result?.payment_url;
  if (!paymentUrl) {
    throw new ErrorHandler("Pay0 did not return a payment URL", 502);
  }

  return paymentUrl;
};

const getPaymentStatus = async (orderId, options = {}) => {
  const isTesting = typeof options === 'object' ? options?.isTesting : false;
  const data = await postForm(
    "/check-order-status",
    {
      user_token: getUserToken(isTesting),
      order_id: orderId,
    },
    isTesting
  );

  if (!data?.status) {
    return false;
  }

  const txnStatus =
    data.result?.txnStatus ||
    data.result?.txn_status ||
    data.txnStatus ||
    data.txn_status;

  return txnStatus === CONSTANTS.PAYMENT.TRANSACTION_STATUS.SUCCESS;
};

export const verifyPay0WebhookHash = (orderId, receivedHash, isTesting = false) => {
  const creds = getPay0Credentials(isTesting);
  const secret = creds.secretKey;
  if (!secret || !orderId || !receivedHash) {
    return false;
  }

  const expectedHash = crypto
    .createHmac("sha256", secret)
    .update(String(orderId))
    .digest("hex");

  try {
    return (
      expectedHash.length === receivedHash.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedHash),
        Buffer.from(receivedHash)
      )
    );
  } catch {
    return false;
  }
};

export default {
  createPaymentGatewayToken,
  createPaymentLink,
  getPaymentStatus,
  verifyPay0WebhookHash,
};
