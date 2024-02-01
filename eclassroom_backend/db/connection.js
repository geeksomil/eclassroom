const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.URL;
console.log(url);
async function connect() {
  await mongoose.connect(url).catch((err) => {
    throw err;
  });
  console.log("database connected");
}
module.exports = connect;
