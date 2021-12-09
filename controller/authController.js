const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrir");
const Admin = require("../models/adminModel");

const signToken = (id) =>
  jwt.sign({ id }, "JWT_SECRET", {
    expiresIn: 60 * 60 * 1000,
  });

const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin.id);
  const cookieOptions = {
    expire: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.Secure = true;

  res.cookie("jwt", token, cookieOptions);

  admin.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      admin,
    },
  });
};

exports.signin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const filter = { username };

  // 1) Check if the username and password is exist.
  if (!username || !password) {
    return next(new AppError("Please provide emusernameail and password.", 400));
  }

  // 2) check if the password is correct.
  const admin = await Admin.findOne(filter);
  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError("Incorrect username or password", 401));
  }

  // 3) If everything is ok send token to client.
  createSendToken(admin, 200, res);
});

// signing up the admin
exports.signup = catchAsync(async (req, res, next) => {
  const newAdmin = await Admin.create({
    username: req.body.username,
    password: req.body.password,
  });

  createSendToken(newAdmin, 201, res);
});

// loging out the admin
exports.signout = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "logged out", {
    expires: new Date(Date.now() + 10 + 1000),
    httpOnly: true,
  });
  console.log(req.originalUrl);
  res.status(200).json({ status: "success" });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if its there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("you are not logged in.Please log in to get access.", 401));
  }

  // 2) Verification token
  const decode = await promisify(jwt.verify)(token, "JWT_SECRET");

  // 3) Check if user still exist
  const freshAdmin = await Admin.findById(decode.id);
  if (!freshAdmin) return next(new AppError("The user blongin to this user no longer exist.", 401));

  req.admin = freshAdmin;
  res.locals.admin = freshAdmin;
  next();
});
