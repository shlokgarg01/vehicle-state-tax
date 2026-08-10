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
    lastLogin: {
      type: Date,
    },
    appVersion: {
      type: String,
      default: "",
    },
    fcmToken: {
      type: String,
      default: "",
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    referralCode: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },
    referredByUserId: {
      type: Schema.Types.ObjectId,
      ref: COLLECTION_NAMES.USER,
    },
    registrationComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});
userSchema.index({ fcmToken: 1 });
mongoose.set("debug", true);

const User = mongoose.model(COLLECTION_NAMES.USER, userSchema);
export default User;
