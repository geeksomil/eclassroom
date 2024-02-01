"use client";
import { Children, useEffect, useState } from "react";
import "./styles.css";
import localStorage from "react-secure-storage";
import Link from "next/link";
const CustomLink = ({ children, href }) => {
  return (
    <Link href={href} passHref>
      {Children.only(children)}
    </Link>
  );
};

function Classroom({ subject, group, educator, code }) {
  return (
    <>
      <CustomLink href={"/Dashboard/" + subject}>
        <div
          className="classroom"
          onClick={() => {
            localStorage.setItem("desc", { subject, group, educator, code });
          }}
        >
          <div className="header">
            <h1>{subject}</h1>
            {group}
            <br></br>
            {educator}
          </div>
          <div className="footer"></div>
        </div>
      </CustomLink>
    </>
  );
}

export default function DashBoard() {
  const [state, setState] = useState("off");
  const [data, setData] = useState([]);
  const [username, setUsername] = useState(" ");
  const [role, setRole] = useState(" ");
  useEffect(() => {
    let username = localStorage.getItem("username");
    let role = localStorage.getItem("role");
    setUsername(username);
    setRole(role);
    (async () => {
      const res = await fetch(
        "http://localhost:8000/getclassrooms?username=" +
          username +
          "&role=" +
          role
      );

      setData((await res.json()).classrooms);
    })();
  }, []);
  function NewClass(props) {
    async function createclassroom(e) {
      e.preventDefault();
      const data = {
        username: props.username,
        data: {
          classname: document.getElementById("classname").value,
          group: document.getElementById("group").value,
          subject: document.getElementById("subject").value,
        },
      };
      let message;
      await fetch("http://localhost:8000/createeducator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((data) => {
          message = data;
        })
        .catch((err) => (message = err));
      console.log(message);
    }
    async function joinclassroom(e) {
      e.preventDefault();
      const data = {
        username,
        educator: document.getElementById("educator").value,
        code: document.getElementById("code").value,
      };
      let res = await fetch("http://localhost:8000/joinclass", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        res = await res.text();
        alert(res);
      } else {
        setState("off");
      }
    }
    return (
      <>
        <form id="classform" className="newclass">
          <div
            style={{ float: "right" }}
            onClick={() => {
              setState("off");
            }}
          >
            ❌
          </div>
          <br></br>
          <br></br>
          {(() => {
            console.log("43");
            console.log(role);
            if (role == "teacher")
              return (
                <>
                  <label style={{ color: "black" }} htmlFor="classname">
                    Class name
                  </label>
                  <br></br>
                  <input
                    style={{ color: "black" }}
                    name="classname"
                    id="classname"
                  ></input>
                  <br></br>
                  <label style={{ color: "black" }} htmlFor="group">
                    Group
                  </label>
                  <br></br>
                  <input name="group" id="group"></input>
                  <br></br>
                  <label style={{ color: "black" }} htmlFor="subject">
                    Subject
                  </label>
                  <br></br>
                  <input name="subject" id="subject"></input>
                  <br></br>
                  <button type="submit" onClick={createclassroom}>
                    CREATE
                  </button>
                </>
              );
            else
              return (
                <>
                  <label htmlFor="educator">Educator name</label>
                  <br></br>
                  <input name="educator" id="educator"></input>
                  <br></br>
                  <label htmlFor="code">Code</label>
                  <br></br>
                  <input name="code" id="code"></input>
                  <br></br>
                  <button type="submit" onClick={joinclassroom}>
                    JOIN
                  </button>
                </>
              );
          })()}
        </form>
      </>
    );
  }
  return (
    <>
      <div id="dashboard">
        <header>
          <div id="hd1">
            <span>E</span> Classroom
          </div>
          <div id="hd2">
            <button onClick={() => setState("on")}>+</button>
            <div>&nbsp;{username[0].toUpperCase()}</div>
          </div>
        </header>
        <hr></hr>

        <main>
          {(() => {
            if (state == "on") {
              return <NewClass username={username}></NewClass>;
            }
          })()}
          {(() => {
            if (data)
              return data.map((x) => (
                <Classroom
                  group={[x.group]}
                  subject={x.subject}
                  educator={x.educator || username}
                  code={x.code}
                />
              ));
          })()}
        </main>
      </div>
    </>
  );
}
