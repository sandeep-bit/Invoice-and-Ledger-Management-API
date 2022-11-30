const catchAsyncError = require("../middleware/catchAsyncError");
const Profile = require("../models/ProfileModel");
const { NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
exports.createProfile = catchAsyncError(async (req, res, next) => {
  const { phoneNumber, contactAddress, website } = req.body;
  const profile = await Profile.create({
    name: req.user.name,
    email: req.user.email,
    phoneNumber,
    contactAddress,
    website,
    logo: {
      public_id: "thid is a simple id",
      url: "logo",
    },
    userID: req.user.id,
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    profile,
  });
});

exports.getAllProfile = catchAsyncError(async (req, res, start) => {
  const profiles = await Profile.find();
  res.status(StatusCodes.OK).json({
    success: true,
    profiles,
  });
});

exports.getProfileById = catchAsyncError(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    throw new NotFoundError("Profile Not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    profile,
  });
});

exports.getProfilebyUser = catchAsyncError(async (req, res, next) => {
  const profile = await Profile.findOne({ userID: req.user.id });
  if (!profile) {
    throw new NotFoundError("Profile Not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    profile,
  });
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const { id: _id } = req.params;
  const profile = await Profile.findOne({ _id });
  if (!profile) {
    throw new NotFoundError("Profile Not found");
  }
  const _updateProfile = await Profile.findByIdAndUpdate(
    profile._id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({
    success: true,
    _updateProfile,
  });
});

exports.deleteProfile = catchAsyncError(async (req, res, next) => {
  const { id: _id } = req.params;
  const profile = await Profile.findById(_id);
  if (!profile) {
    throw new NotFoundError("Profile Not found");
  }
  await Profile.findByIdAndRemove(_id);
  res.status(StatusCodes.OK).json({
    success: true,
  });
});
