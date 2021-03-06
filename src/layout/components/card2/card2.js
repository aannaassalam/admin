import React from "react";
import "./card2.css";
import user from "../../../assets/user.png";
import { Rating } from "@material-ui/lab";
import moment from "moment";
import { Button } from "@material-ui/core";

function Card2({
  id,
  name,
  image,
  onClick,
  rate,
  rating,
  handleDelete,
  viewImages,
  ratings,
}) {
  return (
    <div className={rate ? "card2 no_width" : "card2"} onClick={onClick}>
      {rate ? (
        <>
          <div className="top">
            <div className="main">
              <img src={rating.image || user} alt="" />
              <div className="right">
                <h4>{rating.name}</h4>
                <Rating value={rating.rate} readOnly size="small" />
              </div>
            </div>
            <p className="date">{moment(rating.date.toDate()).format("ll")}</p>
          </div>
          <div className="bottom">
            <p>{rating.review}</p>
            {rating.product_images?.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={viewImages}
                style={{ marginBottom: 10, color: "#fff" }}
              >
                View Images
              </Button>
            )}
            <Button variant="outlined" fullWidth onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="stars">
            <span>
              {!isNaN(
                ratings.reduce((arr, c) => arr + c.rate, 0) /
                  ratings.length.toFixed(1)
              )
                ? (
                    ratings.reduce((arr, c) => arr + c.rate, 0) / ratings.length
                  ).toFixed(1)
                : 0}
              <i className="fas fa-star"></i>
            </span>
            <p>({ratings.length})</p>
          </div>
          <img src={image} alt="" className="img" />
          <h3>{name}</h3>
        </>
      )}
    </div>
  );
}

export default Card2;
