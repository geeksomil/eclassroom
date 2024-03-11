"use client";
import StudentContextProvider from "./context/StudentContextProvider";
export default function _app(props) {
  return <StudentContextProvider>{props.children}</StudentContextProvider>;
}
