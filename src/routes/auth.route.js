const {
  signInController,
  signUpController,
} = require("../controllers/auth.controller");

const express = require("express");
const { check } = require("express-validator");

const authRoute = express.Router();

authRoute.post(
  "/sign-up",
  check("name").not().isEmpty().withMessage("Field name must must be input"),
  check("email").not().isEmpty().withMessage("Field email must must be input"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Field password must must be input"),
  signUpController,
);

authRoute.post(
  "/sign-in",
  check("email").not().isEmpty().withMessage("Field email must must be input"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Field password must must be input"),
  signInController,
);

module.exports = { authRoute };
