import axios from "axios";
import config from "../config/config.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import { CONSTANTS } from "../constants/constants.js";
import Tax from '../models/Tax.js';

class TaxManager {
  constructor() {}

  static createTaxEntry =  async (userId, taxData) => {
    let taxEntry = new Tax({
      ...taxData,
      userId,
    });
    taxEntry = await taxEntry.save();
  
    const populatedEntry = await Tax.findOne({ orderId: taxEntry.orderId });
    return populatedEntry;
  };

  static createPaymentLink = async (orderId, amount, mobileNumber) => {
    const url = config.payment.URL;
    let response = await axios.post(
      url,
      {
        mid: config.payment.mid,
        merchantReferenceId: orderId,
        amount: amount,
        customer_mobile: mobileNumber,
        customer_name: mobileNumber,
        customer_email: mobileNumber,
        redirect_URL: `${config.backendUrl}/api/v1/tax/paymentRedirect`,
        failed_URL: "",
      },
      { headers: { token: config.payment.authToken } }
    );
  
    if (response.data.status) {
      return response.data.data.payPageUrl;
    } else {
      throw new ErrorHandler(response.data.msg || "Failed to create payment URL", 404);
    }
  };

  static getPaymentStatus = async (orderId) => {
    const url = config.payment.statusCheckUrl;
    let response = await axios.post(
      url,
      {
        mid: config.payment.mid,
        merchantReferenceId: orderId
      },
      { headers: { "Content-Type": "application/json", token: config.payment.authToken } }
    );

    if (response.data.status) {
      let transactionStatus = response.data.txnStatus;
      if (transactionStatus === CONSTANTS.PAYMENT.TRANSACTION_STATUS.SUCCESS) {
        return true
      }
    }
    return false;
  }

  static getTaxByOrderId = async (orderId) => {
    const tax = await Tax.findOne({ orderId }).lean();
    if(!tax) throw new ErrorHandler("Tax entry not found", 404);
    return tax;
  }

  static updateTaxByOrderId = async (orderId, updateData) => {
    const taxEntry = await Tax.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true, runValidators: true } 
    );

    if (!taxEntry) throw new ErrorHandler("Tax not found", 404);
    return taxEntry;
  }

  // This picks orders in created status from last 2 hrs & checks if payment is completed.
  // If payment is completed, update the order status to confirmed.
  static updateTaxStatusViaCron = async () => {
    const twoHourAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const taxes = await Tax.find({
      status: CONSTANTS.ORDER_STATUS.CREATED,
      createdAt: { $gte: twoHourAgo },
    }).select("orderId -_id");

    taxes.forEach(async (tax) => {
      const paymentStatus = await this.getPaymentStatus(tax.orderId);
      if(paymentStatus) {
        await this.updateTaxByOrderId(tax.orderId, { status: CONSTANTS.ORDER_STATUS.CONFIRMED });
      }
    }) 
  }
}

export default TaxManager;