const express = require("express");

const authController = require("../controller/authController");
const userController = require("../controller/userController");

const Router = express.Router();

Router.post("/signup", authController.signup);
Router.post("/signin", authController.signin);

Router.use(authController.protect);

Router.get("/signout", authController.signout);
Router.get("/get-my-users", userController.getUsers);
Router.get("/getlogs", userController.getAll);

module.exports = Router;
