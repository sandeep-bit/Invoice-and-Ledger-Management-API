const express = require("express");
const router = express.Router();
const {
  createProfile,
  updateProfile,
  getAllProfile,
  getProfilebyUser,
  getProfileById,
} = require("../controllers/profile");
const {
  authenticatedUser,
  authorizeUser,
} = require("../middleware/authentication");

router.route("/create").post(authenticatedUser, createProfile);
router.route("/profile/me").get(authenticatedUser, getProfilebyUser);
router.route("/edit/:id").patch(authenticatedUser, updateProfile);
router
  .route("/profiles")
  .get(authenticatedUser, authorizeUser("admin"), getAllProfile);
router
  .route("/profile/:id")
  .get(authenticatedUser, authorizeUser("admin"), getProfileById);

module.exports = router;
