import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    code: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const State = mongoose.model("State", stateSchema);
export default State;
// create and search update
// stae-- > tax;
