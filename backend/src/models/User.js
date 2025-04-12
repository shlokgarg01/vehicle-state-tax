import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongooseDelete from "mongoose-delete";
import { INDIAN_PHONE_REGEX } from "../helpers/validators.js";
import COLLECTION_NAMES from "../constants/collection.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    contactNumber: {
      type: Number,
      required: [true, "Please enter your Contact Number."],
      unique: true,
      validate: {
        validator: (val) => INDIAN_PHONE_REGEX.test(val),
        message: "Provided Contact Number is invalid.",
      },
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});
// mongoose.set("debug", true);

const User = mongoose.model(COLLECTION_NAMES.USER, userSchema);
export default User;
