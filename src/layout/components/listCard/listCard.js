import React, { useEffect, useState } from "react";
import "./listCard.css";
import firebase from "firebase";

function ListCard({ productID, noCross, removeItem, cartQuantity }) {
  const [product, setProduct] = useState({});

  useEffect(() => {
    firebase
      .firestore()
      .collection("products")
      .doc(productID)
      .get()
      .then((doc) => setProduct(doc.data()));
  }, []);

  const discount = parseInt(((product.cp - product.sp) / product.cp) * 100);

  return (
    <div className="listCard">
      {product.title ? (
        <>
          {noCross ? null : (
            <span onClick={removeItem}>
              <i className="fas fa-times"></i>
            </span>
          )}
          <img src={product.images[0].image} alt="" />
          <div className="genre">
            <h4>{product.title}</h4>
            <h5>{product.category}</h5>
          </div>
          <div className="price">
            {cartQuantity ? (
              <p>Quantity: {cartQuantity}</p>
            ) : (
              <p className="rating">
                4 <i className="fas fa-star"></i>
              </p>
            )}
            <div className="bottom">
              <p>&#8377;{product.sp}</p>
              <p className="striked">&#8377;{product.cp}</p>
              <p className="discount">{discount}%</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ListCard;
