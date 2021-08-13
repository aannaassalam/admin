import React, { useState } from "react";
import "./login.css";
import logo from "../../../assets/logo.png";
import {
  Button,
  TextField,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import firebase from "firebase";
import { Redirect } from "react-router-dom";
import toaster from "toasted-notes";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleLogin = () => {
    setUploading(true);
    if (email.length > 0 && email.includes("@") && password.length > 0) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          setUploading(false);
          setRedirect(true);
        })
        .catch((err) => {
          console.log(err.message);
          toaster.notify("Something went wrong, Please try again!");
          setUploading(false);
        });
    } else {
      toaster.notify("error");
    }
  };

  if (redirect) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="login_container">
      <div className="login">
        <img src={logo} alt="" />
        <div>
          <TextField
            variant="outlined"
            className="email"
            size="small"
            label="Email"
            value={email}
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            className="email"
            type="password"
            size="small"
            label="Password"
            value={password}
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="last">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="login_button"
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
      <Backdrop className="backdrop" open={uploading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Login;
