let mongoose = require("mongoose");
let educatorSchema = require("./educatorschema.js");
let studentschema = require("./studentsschema.js");
let classroomSchema = require("../classrooms/schema.js");
async function joinclassroom({ username, educator, code }) {
  const emodel = mongoose.model("educator", educatorSchema);
  const smodel = mongoose.model("student", studentschema);
  const cmodel = mongoose.model("classroom", classroomSchema);
  let msg;
  let tuple = await emodel.findOne({ username: educator }).catch(() => {
    msg = "not able to connect to database";
  });
  console.log(1);
  if (msg) return msg;
  if (tuple == null) {
    return "classroom does not exist";
  }
  if (code > tuple.classrooms.length || code == 0) {
    return "classroom does not exist";
  }
  let x = await smodel.findOne({ username });
  if (x == null) {
    await new smodel({
      username,
      classrooms: { ...tuple.classrooms[code - 1], educator },
    })
      .save()
      .then(() => {
        msg = "classroom added succesfully";
      })
      .catch((err) => {
        msg = "not able to connect to database";
      });
    await cmodel
      .updateOne({ educator, code }, { $push: { students: username } })
      .catch((err) => {
        console.log(err);
      });
    return msg;
  } else {
    for (let i = 0; i < x.classrooms.length; i++) {
      if (
        x.classrooms[i].code == code &&
        x.classrooms[i].educator == educator
      ) {
        return "user already exists";
      }
    }
    await smodel.updateOne(
      { username },
      { $push: { classrooms: { ...tuple.classrooms[code - 1], educator } } }
    );
    console.log("hi");
    await cmodel
      .updateOne({ educator, code }, { $push: { students: username } })
      .catch((err) => {
        console.log(err);
      });
    return "classroom added succesfully";
  }
}
module.exports = joinclassroom;
