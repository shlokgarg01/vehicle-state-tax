import Pay0Service from "./pay0.js";
import PayIndiaService from "./payIndia.js";
import SBIePayService from "./sbiePay.js";
import ConstantsManager from "../managers/constantsManager.js";
import CONSTANTS from "../constants/constants.js";

export const getPaymentGateway = async () => {
  const gateway = (
    await ConstantsManager.getConstantValue(
      CONSTANTS.DB_CONSTANT_KEYS.PAYMENT_GATEWAY,
      CONSTANTS.PAYMENT_GATEWAY.PAY0
    )
  ).toLowerCase();

  if (gateway === CONSTANTS.PAYMENT_GATEWAY.PAYINDIA) {
    return PayIndiaService;
  }

  if (gateway === CONSTANTS.PAYMENT_GATEWAY.SBIEPAY) {
    return SBIePayService;
  }

  return Pay0Service;
};

export default {
  getPaymentGateway,
};
