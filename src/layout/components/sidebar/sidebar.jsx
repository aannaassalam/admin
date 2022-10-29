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
      {paths.includes("categories") ? (
        <a href="/categories" className="link active">
          <i className="fa-solid fa-list"></i>
          <p>Categories</p>
        </a>
      ) : (
        <a href="/categories" className="link">
          <i className="fa-solid fa-list"></i>
          <p>Categories</p>
        </a>
      )}
      <div className="link">
        <i className="fa-solid fa-shirt"></i>
        <p>Products</p>
      </div>
      <div className="link">
        <i className="fa-solid fa-boxes-stacked"></i>
        <p>Orders</p>
      </div>
      {paths.includes("nutuyu") ? (
        <a href="/nutuyu" className="link active">
          <i className="fa-solid fa-hashtag"></i>
          <p>Nutuyu</p>
        </a>
      ) : (
        <a href="/nutuyu" className="link">
          <i className="fa-solid fa-hashtag"></i>
          <p>Nutuyu</p>\
        </a>
      )}
      <div className="link">
        <i className="fa-solid fa-gear"></i>
        <p>Settings</p>
      </div>
    </div>
  );
}
