const mongoose = require("mongoose");
const studentschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  classrooms: {
    type: Array,
  },
});
module.exports = studentschema;
