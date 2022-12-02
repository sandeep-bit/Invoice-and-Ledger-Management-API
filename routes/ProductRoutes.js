const express = require("express");
const {
  CreateProduct,
  getAllProductsByFeature,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const { authenticatedUser } = require("../middleware/authentication");
const router = express.Router();
router.route("/product").post(authenticatedUser, CreateProduct);
router.route("/products").get(authenticatedUser, getAllProductsByFeature);
router
  .route("/product/:id")
  .get(authenticatedUser, getProductById)
  .patch(authenticatedUser, updateProduct)
  .delete(authenticatedUser, deleteProduct);

module.exports = router;
