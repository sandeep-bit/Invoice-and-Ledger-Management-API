const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/UserModel");
const Profile = require("../models/ProfileModel");
const { BadRequestError, NotFoundError } = require("../errors");
const sendToken = require("../utils/sendToken");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
// const HOST = process.env.SMTP_HOST;
// const PORT = process.env.SMTP_PORT;
// const USER = process.env.SMTP_USER;
// const PASS = process.env.SMTP_PASS;
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  const user = await User.findOne({ email });
  const profile = await Profile.findOne({ userID: user._id });
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
  sendToken(result, StatusCodes.OK, res, profile);
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please Provide Credentials");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new NotFoundError("User is not registered");
  }
  const isMatched = await user.comparePwd(password);
  if (!isMatched) {
    throw new BadRequestError("Invalid Credentials");
  }
  sendToken(user, StatusCodes.OK, res);
});

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User is not registered");
  }
  const resetToken = user.getResetPasswordToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  try {
    await sendMail(
      email,
      "hancy7791@gmail.com",
      "Click to reset Password",
      `<div> Click the link below to reset</div></br>
      ${resetPasswordUrl}`
    );
    res.status(200).json({
      success: true,
      message: "Check Your gmail",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new BadRequestError("Token Invalid for the request");
  }
  if (req.body.password !== req.body.confrimPassword) {
    throw new NotFoundError("Password doesn't match");
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.save();
  sendToken(user, StatusCodes.OK, res);
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePwd(req.body.oldPassword);
  if (!isPasswordMatched) {
    throw new BadRequestError("Old password incorrect");
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    throw new BadRequestError("Password doesnot match");
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, StatusCodes.OK, res);
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  // const newUser = {
  //   name: `${firstName} ${lastName}`,
  //   email,
  // };
  const user = await User.findById(req.user.id);
  user.name = firstName ? firstName + " " + lastName : user.name;
  user.email = email || user.email;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    sucess: true,
  });
});
//-------------------------------------ADMIN--------------------------------------------------------------------------
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({ role: "user" });
  res.status(StatusCodes.OK).json({
    success: true,
    users,
    count: users.length,
  });
});

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new BadRequestError(`User with Id ${req.params.id} doesn't exist`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
});

exports.updateRole = catchAsyncError(async (req, res, next) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);
  user.role = role;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    sucess: true,
  });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new BadRequestError("No user Found with Id");
  }
  await user.remove(user);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "User Deleted Sucessfully",
  });
});
