const express = require("express");
const {
  getLedgerDataByCustomer,
  getAllLedger,
} = require("../controllers/ledger");
const { authenticatedUser } = require("../middleware/authentication");
const router = express.Router();

router
  .route("/customer/ledger/:id")
  .get(authenticatedUser, getLedgerDataByCustomer);

router.route("/ledgers").get(authenticatedUser, getAllLedger);
