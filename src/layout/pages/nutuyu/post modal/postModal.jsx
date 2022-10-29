import React from "react";
import "./postModal.css";
import profile from "../../../assets/user-profile.png";
import PerComment from "../per comment/perComment";

export default function PostModal({ post, setModal }) {
  return (
    <div className="modal-backdrop">
      <div className="post_modal">
        <div className="image">
          <img src={post.image} alt="" />
        </div>
        <div className="comments-container">
          <div className="user">
            <img src={profile} alt="" />
            <p>John Doe</p>
            <div
              onClick={() => {
                setModal(false);
                // alert("?/");
              }}
            >
              <i className="fa-solid fa-times"></i>
            </div>
          </div>
          <div className="comments">
            {post.comments.map((comment) => (
              <PerComment comment={comment} key={comment.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
