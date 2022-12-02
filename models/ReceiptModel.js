const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    receiptNo: {
      type: Number,
      required: true,
      unique: true,
    },
    paymentRecords: {
      amountPaid: {
        type: Number,
        required: [true, "Please provide Amount Paid"],
      },
      datePaid: {
        type: Date,
        required: true,
        default: Date.now(),
      },
      paymenMethod: {
        type: String,
        enum: ["Cash", "FonePay", "Esewa", "Bank Transfer"],
        required: true,
      },
      note: {
        type: String,
      },
      paidBy: {
        name: {
          type: String,
          required: [true, "Who paid the Amount?"],
          default: "SELF",
        },
        note: {
          type: String,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Receipt", ReceiptSchema);
