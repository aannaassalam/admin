import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import React, { useState } from "react";
import { useNavigation } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login_function = () => {
    if (email.length === 0) {
      console.log("email is null");
      return;
    }
    if (!email.includes("@")) {
      console.log("invalid email");
      return;
    }
    if (password.length < 8) {
      console.log("invalid password");
    }
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((res) => (window.location.href = "/categories"))
      .catch((err) =>
        console.log(
          err.code.replace(/([\/\-])+/g, " ").replace(/(auth\s)/g, "")
        )
      );
  };

  return (
    <div className="login-container">
      <div className="login">
        <h1>Login</h1>
        <p>Sign In to your account</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login_function}>Login</button>
      </div>
    </div>
  );
}
