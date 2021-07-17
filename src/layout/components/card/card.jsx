import React, { useEffect, useState } from "react";
import "./card.css";
import firebase from "firebase";
import Loader from "../loader/loader";

export default function Card({ product, selecting }) {
  const [item, setItem] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    firebase
      .firestore()
      .collection("products")
      .doc(product)
      .get()
      .then((doc) => {
        var product = doc.data();
        product.id = doc.id;
        setItem(product);
        setLoading(false);
      });
  }, [product]);

  const discount = parseInt(((item.cp - item.sp) / item.cp) * 100);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={selecting ? "box small" : "box"}>
          <div className="rating">
            <span>
              4<i className="fas fa-star"></i>
            </span>
          </div>
          <img src={item.images[0].image} alt="" />
          <div className="details">
            <div className="name">
              <p>{item.title}</p>
              <p>{item.category}</p>
            </div>
            <div className="pricing">
              <span className="price">₹{item.sp}</span>
              <span>₹{item.cp}</span>
              <span>{discount}% off</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
