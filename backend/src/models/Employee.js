import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import CONSTANTS from "../constants/constants.js";
import mongooseDelete from "mongoose-delete";
import validator from "validator";
import { INDIAN_PHONE_REGEX } from "../helpers/validators.js";
import COLLECTION_NAMES from "../constants/collection.js";

const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please enter your username."],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      sparse: true,
    },
    contactNumber: {
      type: String,
      sparse: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(CONSTANTS.USER_ROLES),
      default: CONSTANTS.USER_ROLES.MANAGER,
    },
    status: {
      type: String,
      enum: Object.values(CONSTANTS.STATUS),
      default: CONSTANTS.STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

employeeSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

mongoose.set("debug", true);
const Employee = mongoose.model(COLLECTION_NAMES.EMPLOYEE, employeeSchema);
export default Employee;
