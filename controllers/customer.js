const catchAsyncError = require("../middleware/catchAsyncError");
const Customer = require("../models/CustomerModel");
const { NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

exports.RegisterCustomer = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, contactAddress } = req.body;
  const customer = await Customer.findOne({ email, phone });
  if (customer) {
    throw new NotFoundError("Customer is already registered");
  }
  const newCustomer = await Customer.create({
    name: `${firstName} ${lastName}`,
    email,
    phone,
    contactAddress,
    userId: req.user.id,
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    newCustomer,
  });
});

exports.getCustomerByUser = catchAsyncError(async (req, res, next) => {
  const customers = await Customer.find({ userId: req.user.id });
  if (!customers) {
    throw new NotFoundError("No customers Found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    customers,
  });
});

exports.getAllCustomers = catchAsyncError(async (req, res, next) => {
  const customers = await Customer.find();
  if (!customers) {
    throw new NotFoundError("No customers Found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    customers,
  });
});

exports.getCustomerDetails = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new NotFoundError("No customer Found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    customer,
  });
});

exports.updateCustomer = catchAsyncError(async (req, res, next) => {
  const { id: _id } = req.params;
  const customer = await Customer.findOne({ _id, ActiveStatus: true });
  if (!customer) {
    throw new NotFoundError("No customer Found");
  }
  const updateCustomer = await Customer.findByIdAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    updateCustomer,
  });
});
exports.deleteCustomer = catchAsyncError(async (req, res, next) => {
  const { id: _id } = req.params;
  const customer = await Customer.findById(_id);

  if (!customer) {
    throw new NotFoundError("No customer Found");
  }

  customer.ActiveStatus = false;
  await customer.save({ validateBeforeSave: false });
  res.status(StatusCodes.OK).json({
    success: true,
  });
});
