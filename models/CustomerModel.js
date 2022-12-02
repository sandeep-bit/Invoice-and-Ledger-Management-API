const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide Name"],
      maxLength: [30, `Name Cannot exceed 30 Character`],
      minLength: [4, `Name Should have more than 4 character`],
    },
    email: {
      type: String,
      required: [true, `Please provide email`],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    phone: {
      type: Number,
      required: [true, `Please provide Phone Number`],
      maxLength: [10, `Phone Number cannot exceed 10 character`],
    },
    contactAddress: {
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
    },
    ActiveStatus: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
