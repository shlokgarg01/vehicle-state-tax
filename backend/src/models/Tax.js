import mongoose from "mongoose";
import { TAX_MODES } from "../constants/constants.js";

const BaseTaxSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true }, // Common field
    mobileNumber: { type: String, required: true }, // Common field
    seatCapacity: { type: Number }, // Common field (optional)
    taxMode: {
      type: String,
      enum: Object.values(TAX_MODES),
      required: true,
    },
    taxFromTo: { type: Date, required: true }, // Common field
    amount: { type: Number }, // Common field
    file_url: { type: String, default: "" }, // Common field
    is_completed: { type: Boolean, default: false }, // Common field
    order_id: { type: String, default: "" }, // Common field
    payment_id: { type: String, default: "" }, // Common field
  },
  { timestamps: true }
);
// export default BaseTaxSchema;
const BorderTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj, // Inherit common fields
  state: { type: String, required: true }, // Unique field
  borderCity: { type: String, required: true }, // Unique field
  taxUptoDate: { type: Date, required: true }, // Unique field
});

const BorderTax = mongoose.model("BorderTax", BorderTaxSchema);

const RoadTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj, // Inherit common fields
  taxMode: {
    type: String,
    enum: [TAX_MODES.YEARLY, TAX_MODES.QUARTERLY],
    required: true,
  },
  chassisNumber: { type: String, required: true }, // Unique field
});

const RoadTax = mongoose.model("RoadTax", RoadTaxSchema);
const AllIndiaPermitSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj, // Inherit common fields
  taxMode: {
    type: String,
    enum: [TAX_MODES.YEARLY],
    required: true,
  },
  chassisNumber: { type: String, required: true }, // Unique field
});

const AllIndiaPermit = mongoose.model("AllIndiaPermit", AllIndiaPermitSchema);
const AllIndiaTaxSchema = new mongoose.Schema({
  ...BaseTaxSchema.obj, // Inherit common fields
  taxMode: {
    type: String,
    enum: [TAX_MODES.YEARLY, TAX_MODES.QUARTERLY],
    required: true,
  },
  chassisNumber: { type: String, required: true }, // Unique field
});

const AllIndiaTax = mongoose.model("AllIndiaTax", AllIndiaTaxSchema);
export { BorderTax, RoadTax, AllIndiaPermit, AllIndiaTax };

// import mongoose from "mongoose";
// import { TAX_MODES } from "../constants/constants.js";

// // ✅ Common Tax Schema (Base Model)
// const taxSchema = new mongoose.Schema(
//   {
//     vehicleNumber: { type: String, required: true }, // Allows different formats
//     mobileNumber: { type: String, required: true }, // Stores mobile number
//     seatCapacity: { type: Number }, // Can be modified by admin
//     taxMode: {
//       type: String,
//       enum: Object.values(TAX_MODES),
//       required: true,
//     },
//     taxFromTo: { type: Date, required: true }, // Defines the tax validity period
//     amount: { type: Number }, // Amount field, not mandatory
//     file_url: { type: String, default: "" }, // Stores file URL
//     is_completed: { type: Boolean, default: false }, // Status flag
//     order_id: { type: String, default: "" }, // Payment order ID
//     payment_id: { type: String, default: "" }, // Payment transaction ID
//   },
//   {
//     discriminatorKey: "category",
//     timestamps: true, // Automatically manages createdAt and updatedAt
//   }
// );

// const Tax = mongoose.model("Tax", taxSchema);

// // ✅ Border Tax Schema
// const borderTaxSchema = new mongoose.Schema({
//   state: { type: String, required: true }, // State for border tax
//   borderCity: { type: String, required: true }, // Border city name
//   taxUptoDate: { type: Date, required: true }, // Expiry date for border tax
// });

// // ✅ Road Tax Schema
// const roadTaxSchema = new mongoose.Schema({
//   taxMode: {
//     type: String,
//     enum: [TAX_MODES.YEARLY, TAX_MODES.QUARTERLY],
//     required: true,
//   },
//   chassisNumber: { type: String, required: true }, // Chassis number for road tax
// });

// // ✅ All India Permit Tax Schema
// const allIndiaPermitSchema = new mongoose.Schema({
//   taxMode: {
//     type: String,
//     enum: [TAX_MODES.YEARLY],
//     required: true,
//   },
//   chassisNumber: { type: String, required: true }, // Chassis number for permit
// });

// // ✅ All India Tax Schema
// const allIndiaTaxSchema = new mongoose.Schema({
//   taxMode: {
//     type: String,
//     enum: [TAX_MODES.YEARLY, TAX_MODES.QUARTERLY],
//     required: true,
//   },
//   chassisNumber: { type: String, required: true }, // Chassis number for tax
// });

// // ✅ Creating Models Using Discriminators
// const BorderTax = Tax.discriminator("BorderTax", borderTaxSchema);
// const RoadTax = Tax.discriminator("RoadTax", roadTaxSchema);
// const AllIndiaPermit = Tax.discriminator(
//   "AllIndiaPermit",
//   allIndiaPermitSchema
// );
// const AllIndiaTax = Tax.discriminator("AllIndiaTax", allIndiaTaxSchema);

// export { Tax, BorderTax, RoadTax, AllIndiaPermit, AllIndiaTax };
