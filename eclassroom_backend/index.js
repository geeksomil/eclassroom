const express = require("express");
const cors = require("cors");
const addUser = require("./db/users/adduser.js");
const checkUser = require("./db/users/checkuser.js");
const connect = require("./db/connection.js");
const addEducator = require("./db/educators/addEducator.js");
const getClassrooms = require("./db/educators/getClassrooms.js");
const getPosts = require("./db/classrooms/getPosts.js");
const bodyParser = require("body-parser");
const addPost = require("./db/classrooms/addPost.js");
const multer = require("multer");
const joinclassroom = require("./db/educators/joinClassroom.js");
const App = express();
let fileurl;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "../eclassroom/public/uploads");
  },
  filename: function (req, file, cb) {
    fileurl = Date.now() + "-" + file.originalname;
    fileurl = fileurl.replace(/\s/g, "");
    return cb(null, fileurl);
  },
});
const upload = multer({ storage });

App.use(bodyParser.json({ limit: "35mb" }));
App.use(express.urlencoded({ extended: true, limit: "35mb" }));

App.use(cors());
(async () => {
  await connect();
})();
App.post("/adduser", async (req, res) => {
  await addUser(req.body.email, req.body.password, req.body.role)
    .then((message) => {
      console.log(message);
      if (message == "new user added succesfully") res.send(message);
      else res.status(404).send(message);
    })
    .catch((err) => {
      res.status(404).send("error");
    });
});
App.put("/checkuser", async (req, res) => {
  await checkUser(req.body.email, req.body.password)
    .then((message) => {
      console.log(message);
      if (message[0] == "user found") res.send(message);
      else res.status(404).send(message);
    })
    .catch((err) => {
      console.log("Error");
      res.status(404).send("error");
    });
});
App.post("/createeducator", async (req, res) => {
  await addEducator(req.body)
    .then((message) => {
      res.send(message);
    })
    .catch((err) => {
      console.log("Error");
    });
});
App.get("/getclassrooms", async (req, res) => {
  await getClassrooms(req.query.username, req.query.role)
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.status(404).send({ error: "error" });
    });
});
App.post("/joinclass", async (req, res) => {
  await joinclassroom(req.body)
    .then((response) => {
      console.log(response);
      if (response == "classroom added succesfully") res.send(response);
      else res.status(404).send(response);
    })
    .catch((err) => {
      res.status(404).send("error");
    });
});
App.get("/getposts", async (req, res) => {
  await getPosts({ username: req.query.username, code: req.query.code })
    .then((data) => {
      if (data == undefined) res.send({});
      else return res.send(data);
    })
    .catch((err) => res.status(404));
});
App.post("/addpost", upload.single("file"), async (req, res) => {
  console.log(req.file);
  await addPost({ ...req.body, fileurl })
    .then((data) => {
      fileurl = null;
      return res.send("post added succesfully");
    })
    .catch((error) => {
      fileurl = null;
      return res.status(404).send("encountered error");
    });
});

App.listen(8000);
