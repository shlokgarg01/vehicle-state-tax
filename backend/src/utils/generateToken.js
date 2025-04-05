import jwtToken from "../config/config.js";
import jwt from "jsonwebtoken";
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role, contactNumber: user.contactNumber },
    jwtToken.secret,
    { expiresIn: jwtToken.expires || "30d" }
  );
};

export default generateToken;
