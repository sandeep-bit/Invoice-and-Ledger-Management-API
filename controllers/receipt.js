const catchAsyncError = require("../middleware/catchAsyncError");
const Receipt = require("../models/ReceiptModel");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const Ledger = require("../models/LedgerModel");
exports.createReceipt = catchAsyncError(async (req, res, next) => {
  const { customerId, receiptNo, paymentRecords } = req.body;
  const receipt = await Receipt.create({
    customerId,
    creatorId: req.user.id,
    receiptNo,
    paymentRecords,
  });
  await Ledger.create({
    customerId: customerId,
    receiptId: receipt._id,
    description: "From Bill Number",
  });
  res.status(StatusCodes.CREATED).json({
    success: true,
    receipt,
  });
});

exports.getAllReceipt = catchAsyncError(async (req, res, next) => {
  const receipts = await Receipt.find({}).sort({ _id: -1 });
  if (!receipts) {
    throw new NotFoundError("Receipts not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    receipts,
  });
});

exports.getReceiptsByCustomer = catchAsyncError(async (req, res, next) => {
  const receipts = await Receipt.find({ customerId: req.params.id });
  if (!receipts) {
    throw new NotFoundError("Receipts Not Found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    receipts,
  });
});

exports.getReceiptsByUser = catchAsyncError(async (req, res, next) => {
  const receipts = await Receipt.find({ creatorId: req.user.id });
  if (!receipts) {
    throw new NotFoundError("Receipts Not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    receipts,
  });
});

exports.getReceiptById = catchAsyncError(async (req, res, next) => {
  const receipt = await Receipt.findById(req.params.id);
  if (!receipt) {
    throw new NotFoundError("Receipts Not Found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    receipt,
  });
});

exports.UpdateReceipt = catchAsyncError(async (req, res, next) => {
  const receipt = await Receipt.findById(req.params.id);
  if (!receipt) {
    throw new NotFoundError("Receipt Not Found");
  }
  const _updatedReceipt = await Receipt.findByIdAndUpdate(
    receipt._id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({
    success: true,
    _updatedReceipt,
  });
});
