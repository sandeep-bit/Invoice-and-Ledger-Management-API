const express = require("express");
const router = express.Router();
const { registerUser, login } = require("../controllers/user");

router.route("/signup").post(registerUser);
router.route("/").post(login);

module.exports = router;
