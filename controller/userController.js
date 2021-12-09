const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, number } = req.body;

  const newUser = await User.create({
    name,
    number,
    adminName: req.admin.username,
  });

  res.status(201).json({
    status: "success",
    data: newUser,
  });
});
exports.getUsers = catchAsync(async (req, res, next) => {
  const adminName = req.admin.username;

  const users = await User.find({ adminName });

  res.status(200).json({
    status: "success",
    data: users,
  });
});
exports.getAll = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: users,
  });
});
