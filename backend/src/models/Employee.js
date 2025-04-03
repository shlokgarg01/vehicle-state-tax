import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_ROLES, STATUS } from "../constants/constants.js";
import mongooseDelete from "mongoose-delete";
import validator from "validator";

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  username: {
    // ✅ Fixed typo (was 'usnername')
    type: String,
    // required: true,
    unique: true,
    trim: true,
    validate: [validator.isAlphanumeric, "Please enter a valid username"],
  },
  email: {
    type: String,
    // required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  contactNumber: {
    type: String,
    // required: [true, "Please enter your Contact Number."],
    unique: true,
    validate: {
      validator: function (number) {
        return /^[1-9][0-9]{9}$/g.test(number); // Validates 10-digit numbers
      },
      message: "Provided Contact Number is invalid.",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // Do not return password in queries
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.MANAGER, // ✅ Default is "manager"
  },
  status: { type: String, enum: Object.values(STATUS) },
});

// 🔹 Hash Password Before Saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Compare Password
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔹 Soft Delete Plugin
employeeSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
