const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/ProductModel");
const { StatusCodes } = require("http-status-codes");
const ApiFeatures = require("../utils/apiFeatures");
const { NotFoundError } = require("../errors");
const cloudinary = require("cloudinary");
exports.CreateProduct = catchAsyncError(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;
  req.body.userId = req.user.id;
  const product = await Product.create(...req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    product,
  });
});

exports.getAllProductsByFeature = catchAsyncError(async (req, res, next) => {
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  let products = await apiFeature.query;
  let filteredProductCount = products.length;
  apiFeature.pagination(10), (products = await apiFeature.query);
  res.status(StatusCodes.OK).json({
    success: true,
    products,
    productCount,
    filteredProductCount,
  });
});

exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(StatusCodes.OK).json({
    success: true,
    products,
  });
});

exports.getProductById = catchAsyncError(async (rq, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!products) {
    throw new NotFoundError("Product not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    product,
  });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    throw new NotFoundError("Product Not found");
  }
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new NotFoundError("Product Not found");
  }
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "product deleted Sucessfully",
  });
});
