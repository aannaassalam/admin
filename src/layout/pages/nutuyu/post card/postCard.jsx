import { useState } from "react";
import PerComment from "./per comment/perComment";
import profile from "../../../assets/user-profile.png";
import "./postCard.css";

export default function PostCard({ post }) {
  const [modal, setModal] = useState(false);

  const post_modal = () => {
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
              <div onClick={() => setModal(false)}>
                <i className="fa-solid fa-times"></i>
              </div>
            </div>
            <div className="comments">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <PerComment comment={comment} key={comment.id} post={post} />
                ))
              ) : (
                <div className="no_comments">
                  <p>No comments are available for this post.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  var total_comments = 0;
  post.comments.forEach(
    (comment) => (total_comments += comment.replies.length)
  );
  return (
    <>
      <div className="nutuyu-card" onClick={() => setModal(true)}>
        <img src={post.image} alt="" />
        <div className="comments-count">
          {post.comments?.length + total_comments} comments
        </div>
      </div>
      {modal && post_modal()}
    </>
  );
}
