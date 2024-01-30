const mongoose = require("mongoose");
const connect = require("../connection.js");
const educatorSchema = require("./educatorschema.js");
const addEducator = async ({ username, data }) => {
  const Educator = new mongoose.model("educator", educatorSchema);
  let tuple;
  await Educator.findOne({ username })
    .then((res) => {
      tuple = res;
    })
    .catch((err) => {
      console.log("error");
    });
  if (tuple == null) {
    console.log(username);
    await new Educator({
      username: username,
      classrooms: [{ ...data, code: 1 }],
    })
      .save()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    await Educator.updateOne(
      { username },
      { $push: { classrooms: { ...data, code: tuple.classrooms.length + 1 } } }
    )
      .then(() => {
        console.log("updated succesfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
module.exports = addEducator;
