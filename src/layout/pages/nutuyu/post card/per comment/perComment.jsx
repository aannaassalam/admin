import React, { useState } from "react";
import "./perComment.css";
import profile from "../../../../assets/user-profile.png";
import DeleteModal from "../../../../components/delete-modal/delete-modal";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import moment from "moment";

export default function PerComment({ comment, post }) {
  const [replies, setReplies] = useState(false);
  const [delete_modal, setDelete_modal] = useState(false);
  const [replyId, setReplyId] = useState("");

  const actions = (replies_action, replyId, date) => {
    return (
      <div className="actions">
        <span
          onClick={() => {
            setDelete_modal(true);
            replyId && setReplyId(replyId);
          }}
        >
          Delete
        </span>
        {replies_action && (
          <span onClick={() => setReplies(!replies)}>
            {replies ? "Hide" : "View"} replies
          </span>
        )}
        <span>{moment(date).fromNow()}</span>
      </div>
    );
  };

  const delete_comment = () => {
    updateDoc(doc(getFirestore(), "#nutuyu", post.id), {
      comments: post.comments.filter((com) => com.id !== comment.id),
    })
      .then(() => setDelete_modal(false))
      .catch((err) => console.log(err));
  };

  const delete_reply = (replyID) => {
    updateDoc(doc(getFirestore(), "#nutuyu", post.id), {
      comments: post.comments.map((com) => {
        if (com.id === comment.id) {
          com.replies = com.replies.filter((rep) => rep.id !== replyID);
        }
        return com;
      }),
    })
      .then(() => {
        setDelete_modal(false);
        setReplyId("");
      })
      .catch((err) => console.log(err));
  };

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
        {actions(comment.replies.length > 0, "", comment.date.toDate())}
        {replies && (
          <div className="replies">
            {comment.replies.map((reply) => {
              return (
                <div style={{ display: "flex" }} key={reply.id}>
                  <div className="user-image">
                    <img src={profile} alt="" />
                  </div>
                  <div className="comment">
                    <span className="comment_text">
                      <span className="username">harry_potter</span>
                      {reply.comment}
                    </span>
                    {actions(false, reply.id, reply.date.toDate())}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {delete_modal && (
        <DeleteModal
          deleteFunction={() =>
            replyId ? delete_reply(replyId) : delete_comment()
          }
          name={replyId ? "Reply" : "Comment"}
          setModal={(toggle) => {
            setDelete_modal(toggle);
            setReplyId("");
          }}
        />
      )}
    </div>
  );
}
