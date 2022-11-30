const express = require("express");
const {
  RegisterCustomer,
  getCustomerByUser,
  getAllCustomers,
  getCustomerDetails,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer");
const { authenticatedUser } = require("../middleware/authentication");
const router = express.Router();

router.route("/customer/register").post(authenticatedUser, RegisterCustomer);
router.route("/me/customers").get(authenticatedUser, getCustomerByUser);
router.route("/customers").get(authenticatedUser, getAllCustomers);
router
  .route("/customer/:id")
  .get(authenticatedUser, getCustomerDetails)
  .delete(authenticatedUser, deleteCustomer);
router.route("/customer/edit/:id").patch(authenticatedUser, updateCustomer);

module.exports = router;
