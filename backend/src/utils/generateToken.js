import jwt from "jsonwebtoken";
import config from "../config/config.js";
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role, contactNumber: user.contactNumber },
    config.jwtSecret,
    { expiresIn: config.jwtExpire || "30d" }
  );
};

export default generateToken;
