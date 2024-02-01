const EducatorSchema = require("./educatorschema.js");
const studentschema = require("./studentsschema.js");
const { default: mongoose } = require("mongoose");
async function getClassrooms(username, role) {
  if (role == "teacher") {
    const Educator = new mongoose.model("Educator", EducatorSchema);
    let tuple;
    let error;
    await Educator.findOne({ username })
      .then((res) => {
        tuple = res;
      })
      .catch((err) => {
        error = err;
      });
    if (error) return "Error";
    if (tuple == null) return {};
    else return tuple;
  } else {
    const student = new mongoose.model("Student", studentschema);
    let tuple;
    let error;
    await student
      .findOne({ username })
      .then((res) => {
        tuple = res;
      })
      .catch((err) => {
        error = err;
      });
    if (error) return "Error";
    if (tuple == null) return {};
    else return tuple;
  }
}
module.exports = getClassrooms;
