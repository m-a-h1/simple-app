const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// this check if password was modified , it hash the password and then save it to the database
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// this is method that is being used in authController to check if password is currect
AdminSchema.methods.correctPassword = async function (condidatePassword, userPassword) {
  return await bcrypt.compare(condidatePassword, userPassword);
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
