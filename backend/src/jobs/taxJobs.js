import cron from "node-cron";
import TaxManager from "../managers/taxManager.js";

// Runs every 5 mins
// Finds all taxes from last 1hr which are stuck in CREATED status & checks their payment status.
// If the payment is completed, move them to CONFIRMED status.
cron.schedule("*/5 * * * *", async () => {
  console.log("INSIDE CRON JOB");
  TaxManager.updateTaxStatusViaCron();
});
