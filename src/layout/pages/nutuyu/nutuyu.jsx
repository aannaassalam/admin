import React, { useEffect, useState } from "react";
import "./nutuyu.css";
import girl from "../../assets/girl-potrait.jpg";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import PostCard from "./post card/postCard";

export default function Nutuyu() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    onSnapshot(collection(getFirestore(), "#nutuyu"), (snapshot) => {
      const posts = [];
      snapshot.docs.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      setPosts(posts);
    });
  }, []);

  return (
    <div className="nutuyu">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}
