// src/utils/errorHandlerUtils.js
export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`;
    Error.captureStackTrace(this, this.constructor);
  }
}
