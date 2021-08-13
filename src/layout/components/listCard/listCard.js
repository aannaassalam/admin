import React, { useEffect, useState } from "react";
import "./listCard.css";
import firebase from "firebase";

function ListCard({ productID, noCross, removeItem, cartQuantity, variation }) {
  const [product, setProduct] = useState({});

  useEffect(() => {
    firebase
      .firestore()
      .collection("products")
      .doc(productID)
      .get()
      .then((doc) => setProduct(doc.data()));
  }, []);

  const discount = variation
    ? parseInt(((variation.usual - variation.listing) / variation.usual) * 100)
    : product.variations?.length > 0
    ? parseInt(
        ((product.variations[0].usual - product?.variations[0].listing) /
          product?.variations[0].usual) *
          100
      )
    : 0;

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
          {variation && (
            <div style={{ marginLeft: "auto", display: "flex" }}>
              <p>{product.variationName || "Variation"}: </p>
              <p style={{ marginLeft: 10 }}>{variation.variation}</p>
            </div>
          )}
          <div className="price">
            {cartQuantity ? (
              <p>Quantity: {cartQuantity}</p>
            ) : (
              <p className="rating">
                4 <i className="fas fa-star"></i>
              </p>
            )}
            <div className="bottom">
              <p>
                &#8377;
                {variation ? variation.listing : product.variations[0].listing}
              </p>
              <p className="striked">
                &#8377;
                {variation ? variation.usual : product.variations[0].usual}
              </p>
              <p className="discount">{discount}%</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ListCard;
