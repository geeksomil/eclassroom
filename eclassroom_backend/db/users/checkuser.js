const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connect = require("../connection.js");
const userSchema = require("./schema.js");
const bcrypt = require("bcrypt");
dotenv.config();
const url = process.env.url;
async function checkUser(email, password) {
  const User = new mongoose.model("user", userSchema);
  password = password.toString();
  let result = await User.findOne({ email });
  if (result == null) {
    return ["email not found", " "];
  }
  if (await bcrypt.compare(password, result.password))
    return ["incorrect password", " "];
  return ["user found", result.role];
}
module.exports = checkUser;
