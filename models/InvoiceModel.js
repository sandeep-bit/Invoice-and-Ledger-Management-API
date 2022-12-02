const Mongoose = require("mongoose");

const InvoiceSchema = new Mongoose.Schema(
  {
    duedate: {
      type: Date,
      //require: [true, "Please Provide Due Date"],
    },
    items: [
      {
        itemName: {
          type: String,
          required: [true, "Please Provide Item Name"],
          minlength: [3, `Name cannot be less than 3 character`],
        },
        unitPrice: {
          type: Number,
          required: [true, "Please Provide Price Per Item"],
        },
        quantity: {
          type: Number,
          required: [true, "Please Provide Quentity"],
        },
        discount: {
          type: Number,
          default: 0,
        },
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    rates: {
      type: String,
      required: true,
      default: 0,
    },
    vat: {
      type: Number,
      required: true,
      default: 0,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    Total: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["paid", "Partial", "unpaid"],
      default: "unpaid",
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    creatorId: {
      type: Mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: Mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    paymentRecords: [
      {
        amountPaid: {
          type: Number,
        },
        datePaid: {
          type: Date,
        },
        paymenMethod: {
          type: String,
          enum: ["Cash", "FonePay", "Esewa", "Bank Transfer"],
        },
        note: {
          type: String,
        },
        paidBy: {
          name: {
            type: String,
          },
          note: {
            type: String,
          },
        },
      },
    ],
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingStatus: {
      type: String,
      required: true,
      default: "Processing",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Mongoose.model("Invoice", InvoiceSchema);
