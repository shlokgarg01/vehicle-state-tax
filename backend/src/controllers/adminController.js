import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// View all users
const viewUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password"); // Exclude password
  res.status(200).json({ users });
});

const searchUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;

  // If no search term is provided, return all active users
  const filter = search
    ? {
        $and: [
          {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
        ],
      }
    : {}; // If no search term, return all active users
  console.log("Search Filter:", filter);

  const users = await User.find(filter).select("-password"); // Exclude password
  console.log("Matched Users:", users);

  res.status(200).json({ users });
});

// View manager details
const viewManagers = asyncHandler(async (req, res) => {
  const managers = await User.find({ role: "manager" }).select("-password");
  res.status(200).json({ managers });
});

// Increase Manager Limit
// const increaseManagerLimit = asyncHandler(async (req, res) => {
//   const { newLimit } = req.body;
//   if (!newLimit || newLimit <= 0) {
//     res.status(400);
//     throw new Error("Invalid manager limit.");
//   }

//   const admin = await User.findById(req.user._id);
//   if (!admin || admin.role !== "admin") {
//     res.status(403);
//     throw new Error("Only admins can update the manager limit.");
//   }

//   admin.managerLimit = newLimit;
//   await admin.save();
//   res
//     .status(200)
//     .json({ message: `Manager limit updated to ${newLimit}`, admin });
// });

// // Ban or Block a User
// const blockUser = asyncHandler(async (req, res) => {
//   const { userId } = req.params;
//   const user = await User.findById(userId);
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   user.isBlocked = true;
//   await user.save();
//   res.status(200).json({ message: "User blocked successfully", user });
// });

// Soft Delete User
// const softDeleteUser = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   const user = await User.findById(userId);
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   user.isDeleted = true;
//   await user.save();
//   res.status(200).json({ message: "User marked as deleted", user });
// });

// Reset user password
// !  manager password change
const resetPassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = newPassword; // Assume bcrypt hashing happens in a pre-save hook
  await user.save();
  res.status(200).json({ message: "Password reset successful" });
});

// Bulk delete users
const bulkDeleteUsers = asyncHandler(async (req, res) => {
  const { userIds } = req.body; // Array of user IDs

  const result = await User.deleteMany({ _id: { $in: userIds } });
  res
    .status(200)
    .json({ message: `${result.deletedCount} users deleted successfully` });
});

// Send system notifications
const sendNotification = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Logic for sending notification (email, app notification, etc.)
  res.status(200).json({ message: "Notification sent successfully" });
});
export {
  viewUsers,
  searchUsers,
  viewManagers,
  resetPassword,
  bulkDeleteUsers,
  sendNotification,
  // increaseManagerLimit,
  // blocksUser,
  // softDeleteUser,
};
