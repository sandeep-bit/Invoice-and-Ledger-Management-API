const express = require("express");

const router = express.Router();
const {
  registerUser,
  login,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  updateRole,
  getAllUsers,
  deleteUser,
  getUserProfile,
} = require("../controllers/user");
const {
  authenticatedUser,
  authorizeUser,
} = require("../middleware/authentication");

router.route("/signup").post(registerUser);
router.route("/").post(login);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(authenticatedUser, getUserDetails);
router.route("/password/update").put(authenticatedUser, updatePassword);
router.route("/me/update").patch(authenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(authenticatedUser, authorizeUser("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .patch(authenticatedUser, authorizeUser("admin"), updateRole);

router
  .route("/admin/user/:id")
  .delete(authenticatedUser, authorizeUser("admin"), deleteUser);

router
  .route("/admin/user/:id")
  .get(authenticatedUser, authorizeUser("admin"), getUserProfile);

module.exports = router;
