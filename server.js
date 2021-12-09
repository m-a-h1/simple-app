const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dbConnection = require("./utils/dbConnection");

const userRouter = require("./routs/userRouter");
const adminRouter = require("./routs/adminRouter");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// ROUTES
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

dbConnection();

let port = 4000;

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
