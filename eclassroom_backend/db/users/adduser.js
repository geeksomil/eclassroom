const mongoose = require("mongoose");
const validator = require("validator");
const connect = require("../connection.js");
const userSchema = require("./schema.js");
const bcrypt = require("bcrypt");
require("dotenv").config();
const url = process.env.URL;
async function addUser(email, password, role) {
  const User = new mongoose.model("user", userSchema);
  console.log(role);
  let msg;
  let tuple = await User.findOne({ email });
  password = toString(password);
  let encryptpass = await bcrypt.hash(password, 10);
  console.log(encryptpass);
  if (tuple != null) return "email already exist";
  const res = await new User({ email, password: encryptpass, role })
    .save()
    .then(() => {
      msg = "new user added succesfully";
    })
    .catch((err) => {
      console.log(err);
      msg = "invalid email";
    });
  return msg;
}
module.exports = addUser;
