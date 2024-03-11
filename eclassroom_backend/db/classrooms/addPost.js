const mongoose = require("mongoose");
const classroomSchema = require("./schema.js");

async function addPost({ educator, code, post, fileurl, date }) {
  console.log(educator, code, post, fileurl, date);
  console.log(post);
  const Classroom = new mongoose.model("classroom", classroomSchema);
  let tuple = await Classroom.findOne({ educator, code });
  await Classroom.updateOne(
    { educator, code },
    { $push: { posts: [post, fileurl, date, []] } }
  ).catch((err) => {
    console.log("error");
  });
  return "post added succesfully";
}
module.exports = addPost;
