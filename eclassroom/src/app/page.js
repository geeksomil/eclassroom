"use client";
import { Component, useState } from "react";
import SignIn from "./components/SignIn";
import "./page.css";
import SignUp from "./components/SignUp";
import { useRouter } from "next/navigation";
const HomePage = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [jsxState, setJsxState] = useState("signin");
  const router = useRouter();
  const signin = (
    <SignIn
      email={Email}
      password={Password}
      setEmail={setEmail}
      setPassword={setPassword}
      router={router}
    ></SignIn>
  );
  const signup = (
    <SignUp
      email={Email}
      password={Password}
      setEmail={setEmail}
      setPassword={setPassword}
      setJsxState={setJsxState}
    ></SignUp>
  );

  const component = (
    <div style={{ marginLeft: "25%", width: "fit-content" }}>
      Dont have an account
      <span id="signup" onClick={() => setJsxState("signup")}>
        Sign Up
      </span>
    </div>
  );
  return (
    <main id="homepage">
      <div id="maindiv1"></div>
      <div id="maindiv2">
        {(() => {
          if (jsxState == "signin") return signin;
          else return signup;
        })()}
        {(() => {
          if (jsxState == "signin") return component;
        })()}
      </div>
    </main>
  );
};

export default HomePage;
