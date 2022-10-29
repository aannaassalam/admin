import React from "react";
import "./sidebar.css";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const paths = location.pathname.split("/");

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>NuTuYu72</h1>
      </div>
      <a
        href="/categories"
        className={paths.includes("categories") ? "link active" : "link"}
      >
        <i className="fa-solid fa-list"></i>
        <p>Categories</p>
      </a>
      <div className="link">
        <i className="fa-solid fa-shirt"></i>
        <p>Products</p>
      </div>
      <div className="link">
        <i className="fa-solid fa-boxes-stacked"></i>
        <p>Orders</p>
      </div>
      <a
        href="/nutuyu"
        className={paths.includes("nutuyu") ? "link active" : "link"}
      >
        <i className="fa-solid fa-hashtag"></i>
        <p>Nutuyu</p>
      </a>
      <div className="link">
        <i className="fa-solid fa-gear"></i>
        <p>Settings</p>
      </div>
    </div>
  );
}
