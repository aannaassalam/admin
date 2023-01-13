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
      <a
        href="/products"
        className={paths.includes("products") ? "link active" : "link"}
      >
        <i className="fa-solid fa-shirt"></i>
        <p>Products</p>
      </a>
      <a
        href="/orders"
        className={paths.includes("orders") ? "link active" : "link"}
      >
        <i className="fa-solid fa-boxes-stacked"></i>
        <p>Orders</p>
      </a>
      <a
        href="/nutuyu"
        className={paths.includes("nutuyu") ? "link active" : "link"}
      >
        <i className="fa-solid fa-hashtag"></i>
        <p>Nutuyu</p>
      </a>
      <a
        href="/settings"
        className={paths.includes("settings") ? "link active" : "link"}
      >
        <i className="fa-solid fa-gear"></i>
        <p>Settings</p>
      </a>
    </div>
  );
}
