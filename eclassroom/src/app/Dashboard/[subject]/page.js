"use client";
import { useRouter } from "next/navigation";
import localStorage from "react-secure-storage";
import "./styles.css";
import { useEffect, useState } from "react";
export default function f({ params }) {
  let [render, setRender] = useState(0);
  let [username, setUsername] = useState(" ");
  let [posts, setPosts] = useState({ posts: [] });
  let [desc, setDesc] = useState();
  let [role, setRole] = useState(" ");
  let letter = " ";
  function Profile({ name }) {
    if (!name) name = " ";
    return (
      <div id="hd2">
        <div> &nbsp;{name[0].toUpperCase()}</div>
      </div>
    );
  }
  function Post({ name, date, content, filename }) {
    console.log("uploads/" + filename);
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
        <header>
          <Profile name={name || " "}></Profile>
          <div>
            {name}
            <br></br>
            {date}
          </div>
        </header>
        <div id="content">{content}</div>
        <br></br>
        {(() => {
          if (isImage)
            return (
              <a href={"/uploads/" + filename} download={shortFilename}>
                <img
                  alt={shortFilename}
                  src={"/uploads/" + filename}
                  width="800"
                  height="500"
                ></img>
              </a>
            );
          else if (filename)
            return (
              <a href={"/uploads/" + filename} download={shortFilename}>
                {shortFilename}
              </a>
            );
        })()}
      </div>
    );
  }
  const router = useRouter();
  const subject = params.subject;

  useEffect(() => {
    const s = localStorage.getItem("username");
    console.log(s);
    letter = s[0];
    const desc = localStorage.getItem("desc");
    const role = localStorage.getItem("role");
    console.log(desc);
    (async () => {
      let url =
        "http://localhost:8000/getposts?username=" +
        desc.educator +
        "&code=" +
        desc.code;
      let posts = await (await fetch(url)).json();
      if (posts && posts.posts) posts.posts.reverse();
      console.log(posts);
      setPosts(posts);
    })();
    setDesc(desc);
    setUsername(s);
    setRole(role);
  }, []);
  return (
    <>
      <header id="mainheader">
        <div id="hd1">
          <span>E</span> Classroom
        </div>
        <Profile name={username || " "}></Profile>
        <hr></hr>
      </header>
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
            <div style={{ color: "white" }}>
              {subject} code:
              {(() => {
                if (desc) return desc.code;
              })()}
              &nbsp;&nbsp;educator:
              {(() => {
                if (desc) return desc.educator;
              })()}
            </div>
          </div>
        </div>
        {(() => {
          console.log("hi");
          console.log(role);
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
                        "Last Sync: " +
                        currentdate.getDate() +
                        "/" +
                        (currentdate.getMonth() + 1) +
                        "/" +
                        currentdate.getFullYear() +
                        " @ " +
                        currentdate.getHours() +
                        ":" +
                        currentdate.getMinutes();
                      const formdata = new FormData();
                      formdata.append("username", desc.educator);
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
                      formdata.append("date", currentdate);
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
            return posts.posts.map((x) => {
              console.log(x);
              return (
                <Post
                  name={desc.educator}
                  date={x[2]}
                  content={x[0]}
                  filename={x[1]}
                  key={k++}
                ></Post>
              );
            });
          }
        })()}
      </main>
    </>
  );
}
