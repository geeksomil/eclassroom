const mongoose = require("mongoose");
const classroomSchema = require("./schema.js");

async function addPost({
  username,
  code,
  group,
  subject,
  post,
  fileurl,
  date,
}) {
  const Classroom = new mongoose.model("classroom", classroomSchema);
  let tuple;
  await Classroom.findOne({ username, code })
    .then((res) => {
      tuple = res;
    })
    .catch((err) => {
      console.log(err);
    });
  if (tuple == null) {
    await new Classroom({
      username,
      code,
      group,
      subject,
      posts: [],
    }).save();
  }
  await Classroom.updateOne(
    { username, code },
    { $push: { posts: [post, fileurl, date] } }
  );
  return "post added succesfully";
}
module.exports = addPost;
