import mongoose from "mongoose";

const SeatTypeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate seat types like "7+1"
  },
});

const SeatType = mongoose.model("SeatType", SeatTypeSchema);
export default SeatType;
