import React from "react";
import "./banner.css";

export default function Banner({ banner }) {
  return (
    <div className="banner">
      <div className="banner-heading">
        <h3>Banner</h3>
        <button type="button" className="edit-button">
          Edit
        </button>
      </div>
      <img src={banner} alt="" />
    </div>
  );
}
