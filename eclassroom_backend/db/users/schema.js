const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: {
      validator: true,
      message: () => "email already exists",
    },
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});
module.exports = userSchema;
