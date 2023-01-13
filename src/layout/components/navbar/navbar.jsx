import React from "react";
import "./navbar.css";
import { useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Navbar() {
  const location = useLocation();
  const paths = location.pathname.split("/");
  paths.shift();

  const logout = () => {
    signOut(getAuth())
      .then(() => (window.location.href = "/login"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="navbar">
      <div className="navbar-items">
        <p>Categories</p>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="breadcrumb">
        <span className="breadcrumb-link">
          <span>Home</span>
        </span>
        {paths.map((path, idx) => {
          return (
            <span className="breadcrumb-link" key={idx}>
              <span>/</span>
              {idx !== paths.length - 1 ? (
                <a href={`/${path}`}>{path.replace("%20", " ")}</a>
              ) : (
                <span>{path.replace("%20", " ")}</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
