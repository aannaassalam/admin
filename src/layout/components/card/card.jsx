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

  const discount =
    item.variations?.length > 0
      ? parseInt(
          ((item.variations[0].usual - item.variations[0].listing) /
            item.variations[0].usual) *
            100
        )
      : 0;

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
              <span className="price">₹{item.variations[0].listing}</span>
              <span>₹{item.variations[0].usual}</span>
              <span>{discount}% off</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
