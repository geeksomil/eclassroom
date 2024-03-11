const classroomSchema = require("./schema");
const connect = require("../connection.js");
const { default: mongoose } = require("mongoose");
const addClassroom = async ({ educator, code, group, subject }) => {
  await connect();
  const classroom = new mongoose.model("classroom", classroomSchema);
  let msg;
  console.log(code);
  await new classroom({
    educator,
    code,
    group,
    subject,
    posts: [],
    students: [],
  })
    .save()
    .then(() => {
      msg = "classroom created succesfully";
    })
    .catch((err) => {
      console.log(err);
      msg = "classroom already exists";
    });
  console.log(msg);
  return msg;
};
module.exports = addClassroom;
