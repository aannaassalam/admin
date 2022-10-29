import { useState } from "react";
import PostModal from "../post modal/postModal";
import "./postCard.css";

export default function PostCard({ post }) {
  const [modal, setModal] = useState(false);

  var total_comments = 0;
  post.comments.forEach(
    (comment) => (total_comments += comment.replies.length)
  );

  return (
    <div className="nutuyu-card" onClick={() => setModal(true)}>
      <img src={post.image} alt="" />
      <div className="comments-count">
        {post.comments?.length + total_comments} comments
      </div>
      {modal && <PostModal setModal={setModal} post={post} />}
    </div>
  );
}
