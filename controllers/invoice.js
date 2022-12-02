const { NotFoundError } = require("../errors");
const catchAsyncError = require("../middleware/catchAsyncError");
const Invoice = require("../models/InvoiceModel");
const { StatusCodes } = require("http-status-codes");
const Product = require("../models/ProductModel");

exports.createInvoice = catchAsyncError(async (req, res, next) => {
  const {
    items,
    rates,
    vat,
    subTotal,
    Total,
    notes,
    status,
    invoiceNumber,
    shippingPrice,
    shippingStatus,
    paymentRecords,
    customerId,
  } = req.body;

  const invoice = await Invoice.create({
    duedate: Date.now(),
    items,
    rates,
    vat,
    subTotal,
    Total,
    status,
    notes,
    invoiceNumber,
    creatorId: req.user.id,
    customerId,
    paymentRecords,
    shippingPrice,
    shippingStatus,
  });
  if (shippingStatus === "delivered") {
    invoice.items.forEach(async item => {
      await updateStock(item.productId, item.quantity);
    });
  }
  res.status(StatusCodes.CREATED).json({
    success: true,
    invoice,
  });
});

exports.getAllInvoices = catchAsyncError(async (req, res, next) => {
  const invoices = await Invoice.find({}).sort({ _id: -1 });
  if (!invoices) {
    throw new NotFoundError("Invoices not Found");
  }
  let totalAmount = 0;
  invoices.forEach(invoice => {
    totalAmount += invoice.Total;
  });
  res.status(StatusCodes.OK).json({
    sucess: true,
    invoices,
    totalAmount,
    count: invoices.length,
  });
});

exports.getInvoicesByUser = catchAsyncError(async (req, res, next) => {
  const invoices = await Invoice.find({ creatorId: req.user.id });
  if (!invoices) {
    throw new NotFoundError("Invoices not Found");
  }
  res.status(StatusCodes.OK).json({
    sucess: true,
    invoices,
    count: invoices.length,
  });
});

exports.getInvoicesByCustomer = catchAsyncError(async (req, res, next) => {
  const invoices = await Invoice.find({ customerId: req.params.id });
  if (!invoices) {
    throw new NotFoundError("Invoices not Found");
  }
  res.status(StatusCodes.OK).json({
    sucess: true,
    invoices,
    count: invoices.length,
  });
});

exports.getInvoiceById = catchAsyncError(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    throw new NotFoundError("Invoices not Found");
  }
  res.status(StatusCodes.OK).json({
    sucess: true,
    invoice,
  });
});

exports.editInvoice = catchAsyncError(async (req, res, next) => {
  const { id: _id } = req.params;
  const invoice = await Invoice.findById(_id);
  if (!invoice) {
    throw new NotFoundError("Invoices not Found");
  }
  const _updateInvoice = await Invoice.findByIdAndUpdate(
    invoice._id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (req.body.shippingStatus === "Delivered") {
    invoice.items.forEach(async item => {
      await updateStock(item.productId, item.quantity);
    });
  }
  res.status(StatusCodes.OK).json({
    sucess: true,
    _updateInvoice,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
