const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");
const User = require("../models/UserModel");
const catchAsyncError = require("./catchAsyncError");

exports.authenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError("Please Login to access the resources");
  }
  const decoded = jwt.verify(token, process.env.SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

exports.authorizeUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new UnauthorizedError(
          `${req.user.role} is not allowed to access this resources`
        )
      );
    }
    next();
  };
};
