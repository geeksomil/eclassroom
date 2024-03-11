const mongoose = require("mongoose");
const classroomSchema = require("./schema.js");
const connect = require("../connection.js");
async function getPosts({ username, code }) {
  const Classroom = new mongoose.model("classroom", classroomSchema);
  let tuple;
  await Classroom.findOne({ educator: username, code })
    .then((res) => {
      tuple = res;
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(tuple);
  return tuple;
}
module.exports = getPosts;
