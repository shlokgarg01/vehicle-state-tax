import crypto from "crypto";
import axios from "axios";
import config from "../config/config.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";

const getAuth = () => {
  const { keyId, keySecret } = config.razorpay;
  return { username: keyId, password: keySecret };
};

const getPaymentLinksFromResponse = (data) =>
  data?.payment_links || data?.items || [];

const isPaymentLinkPaid = (link) => {
  if (!link) return false;
  if (link.status === "paid") return true;

  const amount = Number(link.amount) || 0;
  const amountPaid = Number(link.amount_paid) || 0;
  if (amount > 0 && amountPaid >= amount) return true;

  const payments = Array.isArray(link.payments) ? link.payments : [];
  return payments.some((payment) => payment.status === "captured");
};

export const verifyPaymentLinkCallback = (query = {}) => {
  const paymentLinkId = query.razorpay_payment_link_id;
  const referenceId = query.razorpay_payment_link_reference_id;
  const status = query.razorpay_payment_link_status;
  const paymentId = query.razorpay_payment_id;
  const signature = query.razorpay_signature;

  if (!paymentLinkId || !referenceId || !status || !paymentId || !signature) {
    return { valid: false, orderId: referenceId || null, paid: false };
  }

  const { keySecret } = config.razorpay;
  if (!keySecret) {
    return { valid: false, orderId: referenceId, paid: false };
  }

  const payload = `${paymentLinkId}|${referenceId}|${status}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  let valid = false;
  try {
    valid =
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );
  } catch {
    valid = false;
  }

  return {
    valid,
    orderId: referenceId,
    paid: valid && status === "paid",
  };
};

const toPaise = (amountInRupees) => {
  const amount = Number(amountInRupees);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ErrorHandler("Invalid payment amount", 400);
  }
  return Math.round(amount * 100);
};

const normalizePhone = (mobileNumber) => String(mobileNumber).replace(/\D/g, "").slice(-10);

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
  const phone = normalizePhone(mobileNumber);

  try {
    const response = await axios.post(
      `${config.razorpay.apiBaseUrl}/payment_links`,
      {
        amount: toPaise(amount),
        currency: "INR",
        accept_partial: false,
        reference_id: String(orderId),
        description: `Vehicle State Tax - ${orderId}`,
        customer: {
          name: `User ${phone}`,
          email: `${phone}@vehiclestatetax.in`,
          contact: phone,
        },
        notify: { sms: false, email: false },
        reminder_enable: false,
        callback_url: `${publicBackendUrl}/api/v1/tax/paymentRedirect`,
        callback_method: "get",
      },
      {
        auth: getAuth(),
        headers: { "Content-Type": "application/json" },
      }
    );

    const shortUrl = response.data?.short_url;
    if (!shortUrl) {
      throw new ErrorHandler("Razorpay did not return a payment URL", 502);
    }

    return shortUrl;
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    const message =
      error.response?.data?.error?.description ||
      error.response?.data?.error?.reason ||
      error.message ||
      "Failed to create Razorpay payment URL";
    throw new ErrorHandler(message, error.response?.status || 502);
  }
};

const getPaymentStatus = async (orderId) => {
  try {
    const response = await axios.get(`${config.razorpay.apiBaseUrl}/payment_links`, {
      auth: getAuth(),
      params: { reference_id: String(orderId) },
    });

    const links = getPaymentLinksFromResponse(response.data);
    if (links.some(isPaymentLinkPaid)) {
      return true;
    }

    const paymentLinkId = links[0]?.id;
    if (paymentLinkId) {
      const linkResponse = await axios.get(
        `${getApiBase()}/payment_links/${paymentLinkId}`,
        { auth: getAuth() }
      );
      return isPaymentLinkPaid(linkResponse.data);
    }

    return false;
  } catch (error) {
    if (error instanceof ErrorHandler) throw error;
    const message =
      error.response?.data?.error?.description ||
      error.message ||
      "Failed to check Razorpay payment status";
    throw new ErrorHandler(message, error.response?.status || 502);
  }
};

export default {
  createPaymentGatewayToken,
  createPaymentLink,
  getPaymentStatus,
};
