import cron from "node-cron";
import TaxManager from "../managers/taxManager.js";

// Gateway payment status polling disabled — manual UPI verification is used instead.

// Cancel payment_pending orders older than 48 hours (runs hourly).
cron.schedule("0 * * * *", async () => {
  await TaxManager.cancelStalePaymentPendingOrders();
});
