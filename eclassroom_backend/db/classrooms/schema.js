const mongoose = require("mongoose");
const classroomSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  code: String,
  group: String,
  subject: String,
  posts: Array,
  students: Array,
});
module.exports = classroomSchema;
