import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
// Role Enum for simplicity
const roles = ["manager", "user", "admin"];

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true, // Clean up any extra spaces
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: roles,
    default: "user",
  },
  isBlocked: { type: Boolean, default: false },
  isDeleted: {
    type: Boolean,
    default: false, // Default is not deleted
  },
  managerLimit: { type: Number, default: 5 },
});
// Password hash middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
// admin (Full access)

// manager (Limited access, controlled by the admin)

// user (Regular user with restricted access)
