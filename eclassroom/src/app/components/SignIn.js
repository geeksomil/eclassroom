"use client";
import localStorage from "react-secure-storage";
import Cookies from "js-cookie";
import { useContext } from "react";
import studentContext from "../context/studentContext";
export default function SignIn({
  email,
  password,
  setEmail,
  setPassword,
  router,
}) {
  const user = useContext(studentContext);
  console.log(user);
  const addUser = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const res = await fetch("http://localhost:8000/checkuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      let msg = await res.json();
      console.log(msg);

      if (!res.ok) {
        // handle error
        console.log("error");
        alert(msg.message[0]);
      } else {
        //success
        user.setUsername(email);
        user.setRole(msg.message[1]);
        Cookies.set("token", msg.token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        router.push("/Dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Sign in</h1>
      <form onSubmit={addUser}>
        <label htmlFor="email">email-Address</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          id="email"
          type="text"
        ></input>
        <label htmlFor="password">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          id="password"
          type="password"
        ></input>
        <button type="submit">C O N T I N U E </button>
        <br></br>
        <br></br>
        <br></br>
      </form>
    </>
  );
}
