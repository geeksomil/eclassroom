export default function SignUp({
  email,
  password,
  setEmail,
  setPassword,
  setJsxState,
}) {
  const addUser = async (e) => {
    e.preventDefault();

    let role;
    if (document.getElementsByName("role")[0].checked)
      role = document.getElementsByName("role")[0].value;
    else role = document.getElementsByName("role")[1].value;
    const userData = { email: email, password: password, role };
    console.log(role);
    if (password != document.getElementById("cpassword").value) {
      alert("password not matching");
      return;
    }
    if (!email.length || !password.length || !role.length) {
      alert("fill all credentials");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const message = await res.text();
      if (!res.ok) {
        alert(message);
      } else {
        setJsxState("signin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Sign up</h1>
      <form onSubmit={addUser}>
        <label htmlFor="email">email-Address</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          id="email"
          type="text"
        ></input>
        <label htmlFor="password">password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          id="password"
          type="text"
        ></input>
        <label htmlFor="cpassword">
          Confirm password<span id="passerror">password does not match</span>
        </label>
        <input
          name="cpassword"
          id="cpassword"
          type="text"
          onChange={(e) => {
            if (e.target.value == password)
              document.getElementById("passerror").style.display = "none";
            else document.getElementById("passerror").style.display = "inline";
          }}
        ></input>
        Your Role
        <label htmlFor="student" style={{ display: "inline-block" }}>
          &nbsp;&nbsp; Student
        </label>
        <input
          type="radio"
          name="role"
          id="student"
          style={{ display: "inline-block" }}
          value={"student"}
        ></input>
        &nbsp;
        <label htmlFor="teacher" style={{ display: "inline-block" }}>
          Teacher
        </label>
        <input type="radio" name="role" id="teacher" value={"teacher"}></input>
        <button type="submit">C O N T I N U E </button>
        <br></br>
        <br></br>
        <br></br>
      </form>
    </>
  );
}
