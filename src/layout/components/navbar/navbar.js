import React from "react";
import "./navbar.css";
import logo from "../../../assets/logo.png";
import { Button } from "@material-ui/core";
import firebase from "firebase";

export default function Navbar(props) {
  return (
    <div className="navbar">
      <img src={logo} alt="" className="logo" />
      <div className="links">
        <a href="/" className="link">
          Dashboard
        </a>
        <a href="/categories" className="link">
          Categories
        </a>
        <a href="/products" className="link">
          Products
        </a>
        <a href="/orders" className="link">
          Orders
        </a>
        <a href="/ratings" className="link">
          Ratings
        </a>
        <a href="/settings" className="link">
          Settings
        </a>
      </div>
      <Button
        variant="contained"
        className="logout"
        onClick={() =>
          firebase
            .auth()
            .signOut()
            .then(() => (window.location.href = "/"))
        }
      >
        Logout
      </Button>
    </div>
  );
}
