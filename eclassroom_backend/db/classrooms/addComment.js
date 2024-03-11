const mongoose = require("mongoose");
const classroomSchema = require("./schema");
async function addComment({ id, content, educator, code, date, username }) {
  const model = new mongoose.model("classroom", classroomSchema);
  code = code + "";
  console.log(code);
  let tuple;
  await model
    .findOne({ educator, code })
    .then((res) => {
      tuple = res;
    })
    .catch(() => {
      console.log("error");
    });
  console.log(tuple);
  tuple.posts[id][3].push([content, date, username]);
  await model.updateOne({ educator, code }, { $set: { posts: tuple.posts } });
}
// addComment({id:3,content:"hello",educator:"abcd@gmail.com",code:"1"});
module.exports = addComment;
