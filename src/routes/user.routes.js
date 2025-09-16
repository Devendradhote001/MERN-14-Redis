const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/home", authMiddleware, (req, res) => {
  return res.send("hello i m home");
});

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

module.exports = router;
