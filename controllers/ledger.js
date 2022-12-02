const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const catchAsyncError = require("../middleware/catchAsyncError");
const Ledger = require("../models/LedgerModel");

exports.getLedgerDataByCustomer = catchAsyncError(async (req, res, next) => {
  const ledger = await Ledger.aggregate([
    {
      $match: { customerId: req.params.id },
    },
    {
      $lookup: {
        from: "Invoice",
        localField: "invoiceId",
        foreignField: "_id",
        as: "InvoiceDetails",
        pipeline: [
          {
            $project: {
              Total: 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "InvoiceDetails",
    },
    {
      $lookup: {
        from: "Receipt",
        localField: "receiptId",
        foreignField: "_id",
        as: "ReceiptDetails",
        pipeline: [
          {
            $project: {
              "paymentRecords.amountPaid": 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "ReceiptDetails",
    },
    {
      $project: {
        description: 1,
        InvoiceDetails: 1,
        ReceiptDetails: 1,
      },
    },
  ]);
  if (!ledger) {
    throw new NotFoundError("Ledger Not Found");
  }
  res.status(StatusCodes.OK).json({
    sucess: true,
    ledger,
  });
});

exports.getAllLedger = catchAsyncError(async (req, res, next) => {
  const ledgers = await Ledger.aggregate([
    {
      $lookup: {
        from: "Invoice",
        localField: "invoiceId",
        foreignField: "_id",
        as: "InvoiceDetails",
        pipeline: [
          {
            $project: {
              Total: 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$InvoiceDetails",
    },
    {
      $lookup: {
        from: "Receipt",
        localField: "receiptId",
        foreignField: "_id",
        as: "ReceiptDetails",
        pipeline: [
          {
            $project: {
              "paymentRecords.amountPaid": 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$ReceiptDetails",
    },
    {
      $lookup: {
        from: "Customer",
        localField: "customerId",
        foreignField: "_id",
        as: "CustomerDetails",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$CustomerDetails",
    },
    {
      $project: {
        description: 1,
        InvoiceDetails: 1,
        ReceiptDetails: 1,
        CustomerDetails: 1,
      },
    },
  ]);
  if (ledgers.length === 0) {
    throw new NotFoundError("Ledgers Not found");
  }
  res.status(StatusCodes.OK).json({
    sucess: true,
    ledgers,
  });
});
