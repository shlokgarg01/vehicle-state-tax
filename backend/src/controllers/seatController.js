import SeatType from "../models/SeatType.js";

// Create Seat Type
export const createSeatType = async (req, res) => {
  try {
    const { label } = req.body;

    const newSeatType = new SeatType({ label });
    await newSeatType.save();

    res.status(201).json({
      success: true,
      message: "Seat type added successfully",
      seatType: newSeatType,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate seat type entered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all seat types
export const getSeatTypes = async (req, res) => {
  try {
    const seatTypes = await SeatType.find();
    res.status(200).json({ success: true, seatTypes });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch seat types",
    });
  }
};

// Delete a seat type
export const deleteSeatType = async (req, res) => {
  try {
    const { id } = req.params;
    await SeatType.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Seat type deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete seat type",
    });
  }
};
