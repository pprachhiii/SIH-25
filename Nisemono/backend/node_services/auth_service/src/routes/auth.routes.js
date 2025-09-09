const express = require("express");
const router = express.Router();
const {
  loginController,
  refreshController,
  logoutController,
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/verifyToken");
const roleCheck = require("../middleware/roleCheck");

// Public routes
router.post("/login", loginController);
router.post("/refresh", refreshController);

// Protected route (any logged-in user)
router.post("/logout", verifyToken, logoutController);

// Admin-only route (can be uncommented/used when needed)
// router.get(
//   "/admin-data",
//   verifyToken,
//   roleCheck(["Super Admin", "Institution Admin"]),
//   adminController
// );

module.exports = router;
