const mongoose = require("mongoose");
const classroomSchema = new mongoose.Schema({
  educator: {
    type: String,
    required: true,
  },
  code: String,
  group: String,
  subject: String,
  posts: Array,
  students: Array,
});
module.exports = classroomSchema;
