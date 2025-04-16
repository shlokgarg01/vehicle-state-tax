import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";
import Employee from "../models/Employee.js";
import CONSTANTS from "../constants/constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import bcrypt from "bcryptjs";
import { getDateRange } from "../utils/getDataRange.js";
import Tax from "../models/Tax.js";
import State from "../models/State.js";
import { deleteFile, uploadFile } from "../helpers/uploadHelpers.js";
// create employee
export const createEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password, contactNumber, name } = req.body;
    const { image } = req?.files || {};

    if (!username || !password) {
      return next(new ErrorHandler("Username and password are required", 400));
    }

    const employeeExists = await Employee.findOne({ username, deleted: false });
    if (employeeExists) {
      return next(
        new ErrorHandler("Employee already exists with this username", 400)
      );
    }

    if (email) {
      const emailExists = await Employee.findOne({ email, deleted: false });
      if (emailExists) {
        return next(
          new ErrorHandler("Employee already exists with this email", 400)
        );
      }
    }

    if (contactNumber) {
      const contactExists = await Employee.findOne({
        contactNumber,
        deleted: false,
      });
      if (contactExists) {
        return next(
          new ErrorHandler(
            "Employee already exists with this contact number",
            400
          )
        );
      }
    }

    const uploadResponse = image ? await uploadFile(image, "new_image") : null;
    const employeeImage = uploadResponse?.url || null;

    const employee = await Employee.create({
      username,
      email,
      password,
      contactNumber,
      image: employeeImage,
      name,
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
        employeeImage: employee.image,

        name: employee.name,
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
export const updateEmployee = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password, contactNumber, status, name } = req.body;
  const { image } = req.files || {};

  const employee = await Employee.findById(id).select("+password");
  if (!employee) return next(new ErrorHandler("Employee not found", 404));

  const isSelfUpdate = req.user._id.toString() === employee._id.toString();
  const isAdminEditingAdmin =
    employee.role === CONSTANTS.USER_ROLES.ADMIN && !isSelfUpdate;

  if (isAdminEditingAdmin && req.user.role !== CONSTANTS.USER_ROLES.ADMIN) {
    return next(
      new ErrorHandler("You are not allowed to modify another admin", 403)
    );
  }
  if (name !== undefined) {
    employee.name = name;
  }
  // Username update
  if (username && username !== employee.username) {
    const existingUser = await Employee.findOne({ username });
    if (existingUser)
      return next(new ErrorHandler("Username is already taken", 400));
    employee.username = username;
  }

  // Email update
  if (email && email.trim() !== employee.email) {
    const existingEmail = await Employee.findOne({ email: email.trim() });
    if (existingEmail)
      return next(new ErrorHandler("Email is already taken", 400));
    employee.email = email.trim();
  }

  // Contact update
  if (contactNumber && contactNumber.trim() !== employee.contactNumber) {
    const existingContact = await Employee.findOne({
      contactNumber: contactNumber.trim(),
    });
    if (existingContact)
      return next(new ErrorHandler("Contact number is already taken", 400));
    employee.contactNumber = contactNumber.trim();
  }

  // Password update
  if (password) {
    employee.password = await bcrypt.hash(password, 10);
  }

  // Status update
  if (status !== undefined) {
    employee.status = status;
  }
  if (employee.image) {
    await deleteFile(employee.image);
  }

  // Image update
  if (image) {
    // Optional: delete old image if needed
    const uploaded = await uploadFile(image, "employee_images");
    if (uploaded.isUploaded) {
      employee.image = uploaded.url;
    } else {
      console.error("Image upload failed:", uploaded.message);
    }
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
      image: employee.image,
      name: employee.name,
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

    const apiFeatures = new ApiFeatures(
      User.find().sort("-createdAt"),
      req.query
    )
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

export const dashboardAnalytics = async (req, res) => {
  try {
    const { filter, fromDate, toDate } = req.query;

    // Apply default date range (last month if no filter)
    const dateFilter = getDateRange(filter || "lastMonth", fromDate, toDate);

    // Base query applied to all
    const dateQuery = dateFilter ? { createdAt: { ...dateFilter } } : {};
    console.log("FILTER:", filter);
    console.log("DATE FILTER GENERATED:", dateFilter);
    const [
      userCount,
      employeeCount,
      adminCount,
      totalTaxes,
      borderTaxCount,
      roadTaxCount,
      allIndiaTaxCount,
      allIndiaPermitCount,
      loadingVehicleCount,
      // managerCount,
    ] = await Promise.all([
      User.countDocuments(dateQuery),
      Employee.countDocuments(dateQuery),
      Employee.countDocuments({
        ...dateQuery,
        role: CONSTANTS.USER_ROLES.ADMIN,
      }),
      Tax.countDocuments(dateQuery),
      Tax.countDocuments({
        ...dateQuery,
      }),
      Tax.countDocuments({
        ...dateQuery,
        taxMode: CONSTANTS.TAX_CATEGORIES.ROAD_TAX,
      }),
      Tax.countDocuments({
        ...dateQuery,
        taxMode: CONSTANTS.TAX_CATEGORIES.ALL_INDIA_TAX,
      }),
      Tax.countDocuments({
        ...dateQuery,
        taxMode: CONSTANTS.TAX_CATEGORIES.ALL_INDIA_PERMIT,
      }),
      Tax.countDocuments({
        ...dateQuery,
        vehicleMode: CONSTANTS.TAX_CATEGORIES.LOADING_VEHICLE,
      }),
    ]);
    console.log("Date Query:", dateQuery);
    res.status(200).json({
      success: true,
      counts: {
        users: userCount,
        employees: employeeCount,
        admin: adminCount,
        totalOrders: totalTaxes,
        borderTax: borderTaxCount,
        roadTax: roadTaxCount,
        allIndiaTax: allIndiaTaxCount,
        allIndiaPermit: allIndiaPermitCount,
        loadingVehicle: loadingVehicleCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
