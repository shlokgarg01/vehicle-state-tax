import Pay0Service from "./pay0.js";
import RazorpayService from "./razorpay.js";
import ConstantsManager from "../managers/constantsManager.js";
import CONSTANTS from "../constants/constants.js";

/** IS_RAZORPAY_LIVE=true → Razorpay; false → Pay0. */
export const getPaymentGateway = async () => {
  const useRazorpay = await ConstantsManager.getBooleanConstant(
    CONSTANTS.DB_CONSTANT_KEYS.IS_RAZORPAY_LIVE,
    true
  );

  return useRazorpay ? RazorpayService : Pay0Service;
};

export default {
  getPaymentGateway,
};
