const express = require("express");

const authController = require("../controller/authController");
const userController = require("../controller/userController");

const Router = express.Router();

Router.use(authController.protect);

Router.post("/createUser", userController.createUser);

module.exports = Router;
