import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";
import Employee from "../models/Employee.js";
import CONSTANTS from "../constants/constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import bcrypt from "bcryptjs";

// create employee
export const createEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password, contactNumber } = req.body;

    if (!username || !password) {
      return next(new ErrorHandler("Username and password are required", 400));
    }

    const employeeExists = await Employee.findOne({ username });
    if (employeeExists) {
      return next(
        new ErrorHandler("Employee already exists with this username", 400)
      );
    }

    if (email) {
      const emailExists = await Employee.findOne({ email });
      if (emailExists) {
        return next(
          new ErrorHandler("Employee already exists with this email", 400)
        );
      }
    }

    if (contactNumber) {
      const contactExists = await Employee.findOne({ contactNumber });
      if (contactExists) {
        return next(
          new ErrorHandler(
            "Employee already exists with this contact number",
            400
          )
        );
      }
    }

    const employee = await Employee.create({
      username,
      email,
      password,
      contactNumber,
    });

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      employee: {
        _id: employee._id,
        username: employee.username,
        email: employee.email,
        contactNumber: employee.contactNumber,
        role: employee.role,
        status: employee.status,
      },
    });
  } catch (error) {
    console.error("Error in creating employee:", error);
    next(new ErrorHandler("Error in creating employee:", 500));
  }
});

// view employee
export const viewManagers = asyncHandler(async (req, res) => {
  try {
    const resultsPerPage = Number(req.query.perPage) || 10;
    const baseQuery = Employee.find().select("-password");
    const apiFeatures = new ApiFeatures(baseQuery, req.query)
      .search(["username", "email", "contactNumber"])
      .filter();

    const filter = apiFeatures.query.getFilter();

    apiFeatures.pagination(resultsPerPage);

    const [managers, totalManagers] = await Promise.all([
      apiFeatures.query,
      Employee.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      managers,
      totalManagers,
      resultsPerPage,
      totalPages: Math.ceil(totalManagers / resultsPerPage),
      currentPage: Number(req.query.page) || 1,
    });
  } catch (error) {
    console.error("Error in viewManagers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in view manager",
    });
  }
});

// update employee
export const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, password, contactNumber, status } = req.body;

  const employee = await Employee.findById(id).select("+password");
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const isSelfUpdate = req.user._id.toString() === employee._id.toString();
  const isAdminEditingAdmin =
    employee.role === CONSTANTS.USER_ROLES.ADMIN && !isSelfUpdate;
  if (isAdminEditingAdmin && req.user.role !== CONSTANTS.USER_ROLES.ADMIN) {
    res.status(403);
    throw new Error("You are not allowed to modify another admin");
  }

  if (username !== undefined) employee.username = username;

  if (email !== undefined) {
    const trimmedEmail = typeof email === "string" ? email.trim() : "";

    if (trimmedEmail !== employee.email) {
      if (trimmedEmail !== "") {
        const existingEmployee = await Employee.findOne({
          email: trimmedEmail,
        });
        if (existingEmployee) {
          res.status(400);
          throw new Error("Email is already taken.");
        }
      }
      employee.email = trimmedEmail || null;
    }
  }

  if (contactNumber !== undefined) {
    const trimmedContact =
      typeof contactNumber === "string" ? contactNumber.trim() : "";

    if (trimmedContact !== employee.contactNumber) {
      if (trimmedContact !== "") {
        const existingEmployee = await Employee.findOne({
          contactNumber: trimmedContact,
        });
        if (existingEmployee) {
          res.status(400);
          throw new Error("Contact number is already taken.");
        }
      }
      employee.contactNumber = trimmedContact || null;
    }
  }

  if (status !== undefined) employee.status = status || null;

  if (password) {
    employee.password = await bcrypt.hash(password, 10);
  }

  await employee.save();

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    employee: {
      _id: employee._id,
      username: employee.username,
      email: employee.email,
      contactNumber: employee.contactNumber,
      role: employee.role,
      status: employee.status,
    },
  });
});

// delete employee
export const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const employee = await Employee.findById(id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }
  if (employee.role === CONSTANTS.USER_ROLES.ADMIN) {
    res.status(403);
    throw new Error("Admin cannot delete themselves");
  }
  await employee.delete();
  res
    .status(200)
    .json({ success: true, message: "Employee deleted successfully" });
});

// search
export const searchUsers = asyncHandler(async (req, res) => {
  try {
    const resultsPerPage = Number(req.query.perPage) || 10;

    const apiFeatures = new ApiFeatures(User.find().sort("-createdAt"), req.query)
      .search(["contactNumber"])
      .filter()
      .pagination(resultsPerPage);

    const filteredUsersQuery = apiFeatures.query.clone();
    const filteredUsersCount = await filteredUsersQuery.countDocuments();
    const users = await apiFeatures.query;
    const totalUsersCount = await User.countDocuments();
    res.status(200).json({
      success: true,
      // count: users.length,
      users,
      resultsPerPage,
      totalUsersCount,
      filteredUsersCount,
    });
  } catch (error) {
    console.error("Error in searchUsers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in admin search user",
    });
  }
});
