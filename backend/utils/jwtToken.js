// creating JWT Token & saving it to cookie
const generateAndSendJWTToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

module.exports = generateAndSendJWTToken