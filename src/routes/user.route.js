const {
  helloWorld,
  createUserController,
} = require("../controllers/user.controller");
const express = require("express");

const userRouters = express.Router();

userRouters.get("/test", helloWorld);

userRouters.post("", createUserController);

module.exports = { userRouters };
