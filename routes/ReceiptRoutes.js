const express = require("express");
const {
  createReceipt,
  getAllReceipt,
  getReceiptsByCustomer,
  getReceiptsByUser,
  getReceiptById,
  UpdateReceipt,
} = require("../controllers/receipt");
const { authenticatedUser } = require("../middleware/authentication");
const router = express.Router();

router.route("/receipt").post(authenticatedUser, createReceipt);
router.route("/receipts").get(authenticatedUser, getAllReceipt);
router
  .route("/customer/:id/receipts")
  .get(authenticatedUser, getReceiptsByCustomer);

router.route("/receipts/me").get(authenticatedUser, getReceiptsByUser);
router
  .route("/receipt/:id")
  .get(authenticatedUser, getReceiptById)
  .patch(authenticatedUser, UpdateReceipt);

module.exports = router;
