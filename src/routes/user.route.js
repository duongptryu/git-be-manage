const {
  createUserController,
  getAUser,
  getListUsers,
  updateUserController,
  deleteUserController,
} = require("../controllers/user.controller");
const express = require("express");
const { check } = require("express-validator");
const { isAuthenticated } = require("../middleware/auth");

const userRouters = express.Router();

userRouters.post(
  "",
  check("name").not().isEmpty().withMessage("Field name must must be input"),
  check("email").not().isEmpty().withMessage("Field email must must be input"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Field password must must be input"),
  createUserController,
);

userRouters.get("/:id", getAUser);

userRouters.get("", isAuthenticated, getListUsers);

userRouters.patch(
  "/:id",
  check("password")
    .not()
    .isEmpty()
    .withMessage("Field name must must be input"),
  check("email").not().isEmpty().withMessage("Field email must must be input"),
  updateUserController,
);

userRouters.delete("/:id", deleteUserController);

module.exports = { userRouters };
