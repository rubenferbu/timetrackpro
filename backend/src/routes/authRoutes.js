const express = require("express");
const { registerCompany, login, me } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
  registerCompanyValidator,
  loginValidator,
} = require("../validators/authValidators");

const router = express.Router();

router.post(
  "/register-company",
  registerCompanyValidator,
  validate,
  registerCompany,
);
router.post("/login", loginValidator, validate, login);
router.get("/me", authMiddleware, me);

module.exports = router;
