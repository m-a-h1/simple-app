const mongoose = require("mongoose");

// use when starting application locally
let mongoUrlLocal = "mongodb://admin:password@localhost:27017";

// use when starting application as docker container
let mongoUrlDocker = "mongodb://admin:password@mongodb";

const dbConnect = () =>
  mongoose.connect(
    mongoUrlLocal,
    // mongoUrlDocker,
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log("database error connection!", err);
      }
    }
  );

mongoose.connection.on("connected", function () {
  console.log("MongoDB event connected");
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB event disconnected");
});

module.exports = dbConnect;
