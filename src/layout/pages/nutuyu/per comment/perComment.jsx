import React from "react";
import "./perComment.css";
import profile from "../../../assets/user-profile.png";

export default function PerComment({ comment }) {
  return (
    <div className="per_comment">
      <div className="user-image">
        <img src={profile} alt="" />
      </div>
      <div className="comment">
        <span className="comment_text">
          <span className="username">harry_potter</span>
          {comment.comment}
        </span>
      </div>
    </div>
  );
}
