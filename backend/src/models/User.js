import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongooseDelete from "mongoose-delete";
import { INDIAN_PHONE_REGEX } from "../helpers/validators.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  contactNumber: {
    type: Number,
    required: [true, "Please enter your Contact Number."],
    unique: true,
    validate: {
      validator: (val) => INDIAN_PHONE_REGEX.test(val),
      message: "Provided Contact Number is invalid.",
    },
  },
});

userSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

const User = mongoose.model("User", userSchema);
export default User;
