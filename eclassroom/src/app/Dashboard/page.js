"use client";
import { Children, useContext, useEffect, useState } from "react";
import "./styles.css";
import Link from "next/link";
import jwt from "jsonwebtoken";
import studentContext from "../context/studentContext";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
const CustomLink = ({ children, href }) => {
  return (
    <Link href={href} passHref>
      {Children.only(children)}
    </Link>
  );
};

export default function DashBoard() {
  const [state, setState] = useState("off");
  const [data, setData] = useState([]);
  const [username, setUsername] = useState(" ");
  const [role, setRole] = useState(" ");
  const [reload, setReload] = useState(0);
  const router = useRouter();
  const user = useContext(studentContext);
  console.log(user);
  useEffect(() => {
    let username = user.username;
    let role = user.role;
    let token = Cookies.get("token");
    console.log(token);
    if (token) {
      let payload = jwt.decode(token);
      username = payload.email;
      role = payload.role;
      user.setRole(role);
      user.setUsername(username);
      console.log(payload);
      console.log(username);
    } else {
      router.push("/");
      return;
    }
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
  }, [reload]);
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
          setState("off");
          setReload(reload + 1);
        })
        .catch((err) => {
          message = err;
          alert("error");
        });
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
        setReload(reload + 1);
      }
    }

    return (
      <>
        <form id="classform" className="newclass" style={{ padding: "1rem" }}>
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
  function Classroom({ subject, group, educator, code }) {
    return (
      <>
        <CustomLink href={"/Dashboard/" + subject}>
          <div
            className="classroom"
            onClick={() => {
              user.setDesc({ subject, group, educator, code });
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
  return (
    <>
      <div id="dashboard">
        <header>
          <div id="hd1">
            <span>E</span> Classroom
          </div>
          <div id="hd2">
            <div style={{ display: "flex" }}>
              <button onClick={() => setState("on")}>+</button>
              <div id="profile" style={{ marginLeft: "1rem" }}>
                &nbsp;{username[0].toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  width: "fit-content",
                  marginLeft: "1rem",
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
