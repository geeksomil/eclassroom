import { useState } from "react";
import studentContext from "./studentContext";
export default function StudentContextProvider(props) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [desc, setDesc] = useState({});

  return (
    <>
      <studentContext.Provider
        value={{ username, setUsername, role, setRole, desc, setDesc }}
      >
        {props.children}
      </studentContext.Provider>
    </>
  );
}
