import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";
import Employee from "../models/Employee.js";
import CONSTANTS from "../constants/constants.js";
import { ErrorHandler } from "../utils/errorHandlerUtils.js";
import Tax from "../models/Tax.js";
import { deleteFile, uploadFile } from "../helpers/uploadHelpers.js";

export const createEmployee = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password, contactNumber, name } = req.body;
    let states = req.body['states[]'] || []
    if (!Array.isArray(states)) {
      states = [states] // convert single item to array
    }

    let categories = req.body['categories[]'] || []
    if (!Array.isArray(categories)) {
      categories = [categories] // convert single item to array
    }

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
      states,
      categories,
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
        states: employee.states,
        categories: employee.categories,
        name: employee.name,
      },
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
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
      message: error.message,
    });
  }
});

// update employee
export const updateEmployee = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password, contactNumber, status, name } = req.body;
  let states = req.body['states[]'] || []
  let categories = req.body['categories[]'] || []
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
    employee.password = password
  }

  employee.states = states
  employee.categories = categories

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
    } else {}
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
      states: employee.states,
      categories: employee.categories,
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const dashboardAnalytics = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required",
      });
    }

    startDate = new Date(`${startDate}T00:00:00+05:30`);
    endDate = new Date(`${endDate}T23:59:59.999+05:30`);
    // endDate.setHours(18, 29, 59, 999);
    let baseQuery = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }

    let taxBaseQuery = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $in: [CONSTANTS.ORDER_STATUS.CONFIRMED, CONSTANTS.ORDER_STATUS.CLOSED, CONSTANTS.ORDER_STATUS.CANCELLED] }
    };

    const [
      userCount,
      employeeCount,
      totalTaxes,
      borderTaxCount,
      roadTaxCount,
      allIndiaTaxCount,
      allIndiaPermitCount,
      loadingVehicleCount,
      totalAmount,
      totalRefundedAmount,
      totalCommission,
    ] = await Promise.all([
      User.countDocuments(baseQuery),
      Employee.countDocuments(baseQuery),
      Tax.countDocuments(taxBaseQuery),
      Tax.countDocuments({
        ...taxBaseQuery,
        category: CONSTANTS.TAX_CATEGORIES.BORDER_TAX,
      }),
      Tax.countDocuments({
        ...taxBaseQuery,
        category: CONSTANTS.TAX_CATEGORIES.ROAD_TAX,
      }),
      Tax.countDocuments({
        ...taxBaseQuery,
        category: CONSTANTS.TAX_CATEGORIES.ALL_INDIA_TAX,
      }),
      Tax.countDocuments({
        ...taxBaseQuery,
        category: CONSTANTS.TAX_CATEGORIES.ALL_INDIA_PERMIT,
      }),
      Tax.countDocuments({
        ...taxBaseQuery,
        category: CONSTANTS.TAX_CATEGORIES.LOADING_VEHICLE,
      }),
      Tax.aggregate([
        { $match: taxBaseQuery },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$amount", 0] } } } }
      ]).then(result => result[0]?.total || 0),
      Tax.aggregate([
        { $match: { ...taxBaseQuery, status: CONSTANTS.ORDER_STATUS.CANCELLED }
        },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$amount", 0] } } } }
      ]).then(result => result[0]?.total || 0),
      Tax.aggregate([
        { $match: taxBaseQuery },
        { $group: { _id: null, total: { $sum: { $ifNull: ["$commission", 0] } } } }
      ]).then(result => result[0]?.total || 0),
    ]);

    res.status(200).json({
      success: true,
      message: "Data fetch success",
      counts: {
        users: userCount,
        employees: employeeCount,
        totalOrders: totalTaxes,
        borderTax: borderTaxCount,
        roadTax: roadTaxCount,
        allIndiaTax: allIndiaTaxCount,
        allIndiaPermit: allIndiaPermitCount,
        loadingVehicle: loadingVehicleCount,
        totalRefundedAmount,
        totalAmount,
        totalCommission,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
