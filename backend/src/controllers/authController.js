import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const adminExists = await User.findOne({ role: "admin" });
  const role = adminExists ? "user" : "admin"; // First user is admin

  const user = await User.create({ name, email, password, role });

  if (user) {
    res.status(201).json({ token: generateToken(user._id), user });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  res.json({ token: generateToken(user._id), user });
});

// Admin can assign manager role
const assignManagerRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // Check if role is "manager"
  if (role !== "manager") {
    res.status(400);
    throw new Error("Role must be 'manager'.");
  }

  // Find the user to assign manager role
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent assigning manager role to an admin
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot assign manager role to an admin");
  }

  // Find the admin's manager count
  const admin = await User.findById(req.user._id); // Assuming admin is logged in
  const managerCount = await User.countDocuments({
    role: "manager",
    admin: admin._id,
  });

  // Check if the admin has reached their manager creation limit
  if (managerCount >= admin.managerLimit) {
    res.status(400);
    throw new Error("Manager limit reached, unable to assign more managers.");
  }

  // Assign the 'manager' role
  user.role = "manager";
  await user.save();

  res.status(200).json({ message: "User role updated to manager", user });
});

// Admin can delete user (except themselves)
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    res.status(403);
    throw new Error("Admin cannot delete themselves");
  }

  await user.deleteOne();
  res.status(200).json({ message: "User deleted successfully" });
});

// Admin can update user details
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Cannot modify another admin");
  }

  user.name = name || user.name;
  user.email = email || user.email;
  if (role && (role === "user" || role === "manager")) {
    user.role = role;
  }

  await user.save();
  res.status(200).json({ message: "User updated successfully", user });
});

export { registerUser, loginUser, assignManagerRole, deleteUser, updateUser };
// viewUsers,
// searchUsers,
// viewManagers,
// resetPassword,
// bulkDeleteUsers,
// sendNotification,
// increaseManagerLimit,
// blockUser,
// softDeleteUser,
