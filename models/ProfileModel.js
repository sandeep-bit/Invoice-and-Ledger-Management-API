const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: Number,
      maxLength: 10,
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
    logo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    website: {
      type: String,
    },
    userID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", ProfileSchema);
