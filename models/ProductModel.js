const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "please enter the product name"],
    trim: true,
  },
  description: {
    type: String,
    require: [true, "Please Enter the description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter the price"],
    maxlength: [5, "price cannot exceed 5 Character"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter the Category"],
  },
  stock: {
    type: Number,
    required: [true, "please Enter the stock"],
    maxlength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", ProductSchema);
