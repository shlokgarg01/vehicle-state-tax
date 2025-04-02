import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongooseDelete from "mongoose-delete";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  contactNumber: {
    type: String,
    required: [true, "Please enter your Contact Number."],
    unique: true,
    validate: {
      validator: function (number) {
        return /^[1-9][0-9]{9}$/g.test(number);
      },
      message: "Provided Contact Number is invalid.",
    },
  },

  password: {
    type: String,
    required: true,
    select: false, // Hide password by default
  },
});

// 🔹 Hash Password Before Saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Compare Password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔹 Soft Delete Plugin
userSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

const User = mongoose.model("User", userSchema);
export default User;
