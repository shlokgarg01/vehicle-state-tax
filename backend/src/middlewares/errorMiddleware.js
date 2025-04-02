import ErrorHandler from "../utils/errorHandlerUtils.js";

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // CastError - for example, invalid _id format
  if (err.name === "CastError") {
    err = new ErrorHandler(`Resource not Found. Invalid: ${err.path}`, 400);
  }

  // Mongoose Duplicate value error
  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue)} entered`,
      400
    );
  }

  // Wrong JWT Token error
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("JSON Web Token is invalid. Please try again.", 400);
  }

  // Expired JWT Token error
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON Web Token is expired. Please try again.", 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // stackTrace: process.env.NODE_ENV === "development" ? err.stack : null
  });
};

export default errorHandler;
