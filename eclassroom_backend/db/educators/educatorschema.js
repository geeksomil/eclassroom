const mongoose = require("mongoose");
const educatorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  classrooms: {
    type: Array,
  },
});
module.exports = educatorSchema;
