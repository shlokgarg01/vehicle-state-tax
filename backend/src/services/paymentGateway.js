import PaygicService from "./paygic.js";
import RazorpayService from "./razorpay.js";
import ConstantsManager from "../managers/constantsManager.js";
import CONSTANTS from "../constants/constants.js";

export const getPaymentGateway = async () => {
  const useRazorpay = await ConstantsManager.getBooleanConstant(
    CONSTANTS.DB_CONSTANT_KEYS.IS_RAZORPAY_LIVE,
    true
  );

  return useRazorpay ? RazorpayService : PaygicService;
};

export default {
  getPaymentGateway,
};
