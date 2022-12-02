const express = require("express");
const {
  createInvoice,
  getAllInvoices,
  getInvoicesByUser,
  getInvoicesByCustomer,
  getInvoiceById,
  editInvoice,
} = require("../controllers/invoice");
const router = express.Router();
const { authenticatedUser } = require("../middleware/authentication");

router.route("/invoice").post(authenticatedUser, createInvoice);
router.route("/invoices").get(authenticatedUser, getAllInvoices);
router.route("/invoices/me").get(authenticatedUser, getInvoicesByUser);
router
  .route("/customer/:id/invoices/")
  .get(authenticatedUser, getInvoicesByCustomer);
router
  .route("/invoice/:id")
  .get(authenticatedUser, getInvoiceById)
  .patch(authenticatedUser, editInvoice);

module.exports = router;
