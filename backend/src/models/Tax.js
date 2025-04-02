import mongoose from "mongoose";

// Common Tax Schema
const taxSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true }, // Changed to String for flexibility
    mobileNumber: { type: String, required: true }, // Changed to String to support different formats
    seatCapacity: { type: Number, enum: ["4+1", "5+1", "6+1"] }, // seating capacity change by admin
    taxMode: {
      type: String,
      enum: ["yearly", "days", "quarterly"],
      required: true,
    },
    taxFromTo: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      //   required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "category", timestamps: true }
);

const Tax = mongoose.model("Tax", taxSchema);

// Border Tax Schema
const borderTaxSchema = new mongoose.Schema({
  state: { type: String, required: true }, // Required for Border Tax
  borderCity: { type: String, required: true }, // Renamed for clarity
  taxUptoDate: { type: Date, required: true },
});

// Road Tax Schema
const roadTaxSchema = new mongoose.Schema({
  taxMode: {
    type: String,
    enum: ["yearly", "quarterly"],
    required: true,
  },
  chassisNumber: { type: String, required: true },
});

// All India Permit Tax Schema
const allIndiaPermitSchema = new mongoose.Schema({
  taxMode: {
    type: String,
    enum: ["yearly"],
    required: true,
  },
  chassisNumber: { type: String, required: true },
});

// All India Tax Schema
const allIndiaTaxSchema = new mongoose.Schema({
  taxMode: {
    type: String,
    enum: ["yearly", "quarterly"],
    required: true,
  },
  chassisNumber: { type: String, required: true },
});

// Creating Models Using Discriminators
const BorderTax = Tax.discriminator("BorderTax", borderTaxSchema);
const RoadTax = Tax.discriminator("RoadTax", roadTaxSchema);
const AllIndiaPermit = Tax.discriminator(
  "AllIndiaPermit",
  allIndiaPermitSchema
);
const AllIndiaTax = Tax.discriminator("AllIndiaTax", allIndiaTaxSchema);

export { Tax, BorderTax, RoadTax, AllIndiaPermit, AllIndiaTax };
