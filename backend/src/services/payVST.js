import crypto from "crypto";
import axios from "axios";
import config from "../config/config.js";
import CONSTANTS from "../constants/constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

const normalizeMobile = (mobileNumber) =>
  String(mobileNumber).replace(/\D/g, "").slice(-10);

const getUserToken = () => {
  const token = config.payVST.userToken || config.pay0.userToken;
  if (!token) {
    throw new ErrorHandler("PayVST user token is not configured", 500);
  }
  return token;
};

const postForm = async (path, fields) => {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      body.append(key, String(value));
    }
  });

  const baseUrl = String(
    config.payVST.apiBaseUrl || config.pay0.apiBaseUrl || "https://payvst.in/api"
  ).replace(/\/$/, "");
  const endpoint = path.startsWith("/") ? path : `/${path}`;

  const response = await axios.post(`${baseUrl}${endpoint}`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
};

/** PayVST does not use a separate token endpoint — API key is sent per request. */
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

  const data = await postForm("/create-order", {
    customer_mobile: normalizeMobile(mobileNumber),
    customer_name: normalizeMobile(mobileNumber) || "Customer",
    user_token: getUserToken(),
    amount: Number(amount),
    order_id: orderId,
    redirect_url: `${publicBackendUrl}/api/v1/tax/paymentRedirect?order_id=${encodeURIComponent(orderId)}`,
    remark1: "Vehicle State Tax",
    remark2: orderId,
  });

  if (!data?.status) {
    throw new ErrorHandler(
      data?.message || "Failed to create PayVST payment link",
      400
    );
  }

  const paymentUrl = data?.result?.payment_url;
  if (!paymentUrl) {
    throw new ErrorHandler("PayVST did not return a payment URL", 502);
  }

  return paymentUrl;
};

const getPaymentStatus = async (orderId) => {
  try {
    const data = await postForm("/check-order-status", {
      user_token: getUserToken(),
      order_id: orderId,
    });

    if (!data || data.status === false) {
      return false;
    }

    const result = data.result || data.data;

    const txnStatus = String(
      result?.txnStatus ||
      result?.txn_status ||
      data?.txnStatus ||
      data?.txn_status ||
      ""
    ).toUpperCase();

    // Must strictly check transaction status since API returns status: true for failed transactions as well
    const isSuccess =
      txnStatus === CONSTANTS.PAYMENT.TRANSACTION_STATUS.SUCCESS ||
      txnStatus === "COMPLETED" ||
      txnStatus === "SUCCESS" ||
      txnStatus === "TXN_SUCCESS" ||
      txnStatus === "PAID";

    return isSuccess;
  } catch (e) {
    console.error("[PayVST getPaymentStatus error]:", e?.response?.data || e.message);
    return false;
  }
};

export const verifyPayVSTWebhookHash = (orderId, receivedHash) => {
  const secret = config.payVST.secretKey || config.pay0.secretKey;
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
  verifyPayVSTWebhookHash,
};
