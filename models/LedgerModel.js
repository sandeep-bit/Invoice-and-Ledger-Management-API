const mongoose = require("mongoose");

const LedgerSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    invoiceId: {
      type: mongoose.Schema.ObjectId,
      ref: "Invoice",
    },
    description: {
      type: String,
      require: [true, "Please Provide description"],
    },
    receiptId: {
      type: mongoose.Schema.ObjectId,
      ref: "Receipt",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ledger", LedgerSchema);
