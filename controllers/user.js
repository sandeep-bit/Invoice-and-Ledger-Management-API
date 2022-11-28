const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/UserModel");
const { BadRequestError, NotFoundError } = require("../errors");
const sendToken = require("../utils/sendToken");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new BadRequestError("User Already Registered");
  }
  if (password !== confirmPassword) {
    throw new BadRequestError("Password Doesn't matched");
  }
  const result = await User.create({
    email,
    password,
    name: `${firstName} ${lastName}`,
  });
  sendToken(result, 200, res);
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User is not registered");
  }
  const isMatched = await user.comparePwd(password);
  if (!isMatched) {
    throw new BadRequestError("Invalid Credentials");
  }
  sendToken(user, 200, res);
});

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User is not registered");
  }
});
