"use client";
import { useRouter } from "next/navigation";
import "./styles.css";
import CLOUD_NAME from "@/config/constants.js";
import { useContext, useEffect, useState } from "react";
import studentContext from "@/app/context/studentContext";
export default function f({ params }) {
  let [render, setRender] = useState(0);
  let [username, setUsername] = useState(" ");
  let [posts, setPosts] = useState({ posts: [] });
  let [desc, setDesc] = useState();
  let [role, setRole] = useState(" ");
  let user = useContext(studentContext);
  let letter = " ";
  function Profile({ name }) {
    console.log(name);
    if (!name) name = " ";
    return (
      <div id="hd2" title={name}>
        <div style={{ color: "white", backgroundColor: "#7b1fa2" }}>
          {" "}
          &nbsp;{name[0].toUpperCase()}
        </div>
      </div>
    );
  }
  function Post({ name, date, content, filename, id, replies }) {
    console.log("uploads/" + filename);
    let [on, setOn] = useState("off");
    function isImageUrl(url) {
      // Define a list of image file extensions
      if (!url) return false;
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
        ".svg",
      ];
      let lowercaseUrl;
      lowercaseUrl = url.toLowerCase();
      return imageExtensions.some((extension) =>
        lowercaseUrl.endsWith(extension)
      );
    }
    let isImage = isImageUrl(filename);
    let shortFilename;
    if (filename) shortFilename = filename.substring(filename.indexOf("-") + 1);
    return (
      <div id="post">
        <div style={{ border: "2.5px solid #eff0f1" }}>
          <header>
            <Profile name={name || " "}></Profile>
            <div>
              <div style={{ fontWeight: "bolder" }}>{name}</div>
              {date}
            </div>
          </header>
          <div id="content">{content}</div>
        </div>
        <br></br>
        {(() => {
          if (isImage)
            return (
              <a
                href={
                  "https://res.cloudinary.com/" +
                  CLOUD_NAME +
                  "/image/upload/" +
                  filename
                }
                download={shortFilename}
              >
                <img
                  alt={shortFilename}
                  src={
                    "https://res.cloudinary.com/" +
                    CLOUD_NAME +
                    "/image/upload/" +
                    filename
                  }
                  width="500"
                  height="500"
                ></img>
              </a>
            );
          else if (filename)
            return (
              <a
                href={
                  "https://res.cloudinary.com/" +
                  CLOUD_NAME +
                  "/image/upload/" +
                  filename
                }
                download={shortFilename}
              >
                {shortFilename}
              </a>
            );
        })()}
        <button
          style={{
            display: "flex",
            fontSize: "1rem",
            border: "none",
            backgroundColor: "white",
          }}
          onClick={() => {
            if (on == "on") setOn("off");
            else setOn("on");
          }}
        >
          <img
            src="/images/group.png"
            style={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          ></img>{" "}
          &nbsp; class comments
        </button>
        <br></br>
        <NewReply id={id}></NewReply>

        <div>
          {(() => {
            if (replies && on == "on") {
              return replies.map((x) => {
                return <Reply name={x[2]} content={x[0]} date={x[1]}></Reply>;
              });
            }
          })()}
        </div>
      </div>
    );
  }
  const router = useRouter();
  const subject = params.subject;

  useEffect(() => {
    const s = user.username;
    if (Object.keys(user.username).length === 0) {
      router.push("/Dashboard");
      return;
    }
    console.log(user);
    letter = s[0];
    const desc = user.desc;
    const role = user.role;
    (async () => {
      let url =
        "http://localhost:8000/getposts?username=" +
        desc.educator +
        "&code=" +
        desc.code;
      let posts = await (await fetch(url)).json();
      if (posts && posts.posts) posts.posts.reverse();
      setPosts(posts);
    })();
    setDesc(desc);
    setUsername(s);
    setRole(role);
  }, [render]);
  function NewReply({ id }) {
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes();
    return (
      <>
        <div style={{ display: "flex" }}>
          <Profile name={username}></Profile>
          <textarea
            id="newreply"
            placeholder="Add class comment"
            style={{ border: "2.5px solid #eff0f1", width: "80%" }}
          ></textarea>
          <button
            style={{
              border: "none",
              backgroundColor: "inherit",
              width: "2rem",
              fontSize: "1.5rem",
              color: "Grey",
            }}
            onClick={async (e) => {
              e.preventDefault();
              let content = document.getElementById("newreply").value;
              await fetch("http://localhost:8000/addcomment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id,
                  content,
                  educator: desc.educator,
                  code: desc.code,
                  date: datetime,
                  username,
                }),
              });
              setRender(render + 1);
            }}
          >
            ▶
          </button>
        </div>
      </>
    );
  }
  function Reply({ name, date, content }) {
    console.log("date : ", date);
    return (
      <div style={{ marginTop: "0.5rem" }}>
        <header>
          <Profile name={name || " "}></Profile>
          <div>
            <div style={{ fontWeight: "bolder" }}>{name}</div>
            {date}
          </div>
        </header>
        <div style={{ marginTop: "1rem" }}>
          <div>{content}</div>
        </div>
      </div>
    );
  }
  return (
    <>
      <header id="mainheader">
        <div id="hd1">
          <span>E</span> Classroom
        </div>
        <div
          style={{
            float: "right",
            display: "flex",
          }}
          id="rightdiv"
        >
          <div
            style={{
              borderRadius: "50%",
              border: "2px solid black",
              height: "2rem",
              width: "2rem",
              fontSize: "1.5rem",
              paddingTop: "1px",
              marginRight: "1rem",
              fontWeight: "bold",
              boxSizing: "border-box",
            }}
            onClick={() => {
              let info = document.getElementById("info");
              console.log(info.style.display);
              if (info.style.display == "block") info.style.display = "none";
              else info.style.display = "block";
            }}
          >
            &nbsp; i
          </div>
          <Profile name={username || " "}></Profile>
          <div
            style={{
              fontSize: "0.8rem",
              // marginLeft: "1rem",
              width: "fit-content",
            }}
          >
            <img
              style={{
                height: "2rem",
                width: "2.5rem",
                display: "block",
                marginLeft: "-10%",
              }}
              src="/images/exit.png"
              onClick={() => {
                router.push("/");
              }}
            ></img>

            <div>Sign Out</div>
            <br></br>
          </div>
        </div>
        <hr></hr>
      </header>
      <div id="info">
        <table bgcolor="#eaf1fb">
          <tbody>
            <tr>
              <th></th>
              <th></th>
              <th>
                <button
                  style={{
                    float: "right",
                    border: "none",
                    backgroundColor: "inherit",
                  }}
                  onClick={() => {
                    let info = document.getElementById("info");
                    info.style.display = "none";
                  }}
                >
                  ❌
                </button>
              </th>
            </tr>
            <tr>
              <th>Subject &nbsp;</th>
              <th> : </th>
              <th>{user.desc.subject}</th>
            </tr>
            <tr>
              <th>group &nbsp;</th>
              <th> : </th>
              <th>{user.desc.group}</th>
            </tr>
            <tr>
              <th>Code &nbsp;</th>
              <th> : </th>
              <th>{user.desc.code}</th>
            </tr>
            <tr>
              <th>Students &nbsp;</th>
              <th> : </th>
              <th>
                {(() => {
                  if (posts && posts.students) {
                    let arr = [];
                    let s = "";
                    for (let i = 0; i < posts.students.length; i++)
                      arr.push(<div>{posts.students[i]}</div>);
                    return arr;
                  }
                })()}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <main>
        <div
          id="title"
          style={{
            height: "15rem",
            width: "100vw",
            background: 'url("/images/background.webp")',
            backgroundSize: "cover",
          }}
        >
          <div>
            {" "}
            <div style={{ color: "white" }}>{subject}</div>
          </div>
        </div>
        {(() => {
          if (role == "teacher")
            return (
              <>
                <div id="newpost">
                  <div id="postdiv1">
                    <Profile name={username}></Profile>
                    <textarea
                      placeholder="Announce something for your class"
                      rows="2"
                      cols="200"
                      onClick={(e) => {
                        e.target.rows = 10;
                        document.getElementById("addpostbtn").style.display =
                          "inline-block";
                        document.getElementById("cancelbtn").style.display =
                          "inline-block";
                      }}
                    ></textarea>
                    <input type="file" id="file" name="file"></input>
                  </div>
                  <button
                    id="addpostbtn"
                    onClick={async () => {
                      var currentdate = new Date();
                      var datetime =
                        currentdate.getDate() +
                        "/" +
                        (currentdate.getMonth() + 1) +
                        "/" +
                        currentdate.getFullYear() +
                        " " +
                        currentdate.getHours() +
                        ":" +
                        currentdate.getMinutes();
                      const formdata = new FormData();
                      formdata.append("educator", desc.educator);
                      formdata.append("code", desc.code);
                      formdata.append("group", desc.group);
                      formdata.append("subject", desc.subject);
                      formdata.append(
                        "post",
                        document.getElementsByTagName("textarea")[0].value
                      );
                      formdata.append(
                        "file",
                        document.getElementById("file").files[0]
                      );
                      formdata.append("date", datetime);
                      let msg = await fetch("http://localhost:8000/addpost", {
                        method: "post",
                        body: formdata,
                      });
                      msg = await msg.text();
                      document.getElementsByTagName("textarea")[0].value = "";
                      document.getElementsByTagName("textarea")[0].rows = 2;
                      document.getElementById("addpostbtn").style.display =
                        "none";
                      document.getElementById("cancelbtn").style.display =
                        "none";
                      setRender(render + 1);
                    }}
                  >
                    POST
                  </button>
                  <button
                    id="cancelbtn"
                    onClick={(e) => {
                      document.getElementsByTagName("textarea")[0].value = "";
                      document.getElementsByTagName("textarea")[0].rows = 2;
                      document.getElementById("addpostbtn").style.display =
                        "none";
                      document.getElementById("cancelbtn").style.display =
                        "none";
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </>
            );
        })()}
        {(() => {
          if (posts.posts) {
            let k = 1;
            let n = posts.posts.length;
            return posts.posts.map((x) => {
              console.log(k);

              return (
                <>
                  <Post
                    name={desc.educator}
                    date={x[2]}
                    content={x[0]}
                    filename={x[1]}
                    id={n - k}
                    replies={x[3]}
                    key={k++}
                  ></Post>
                </>
              );
            });
          }
        })()}
      </main>
    </>
  );
}
