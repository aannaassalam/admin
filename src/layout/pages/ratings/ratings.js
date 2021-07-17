import React, { useEffect, useState } from "react";
import "./ratings.css";
import {
  Backdrop,
  Button,
  CircularProgress,
  Modal,
  TextField,
} from "@material-ui/core";
import rating from "../../../assets/rating.png";
import firebase from "firebase";
import Card2 from "../../components/card2/card2";
import Loader from "../../components/loader/loader";
import { Rating } from "@material-ui/lab";
import toaster from "toasted-notes";
import moment from "moment";

function Ratings() {
  const [products, setProducts] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [userName, setUserName] = useState("");
  const [packaging, setPackaging] = useState(0);
  const [value_for_money, setValue_for_money] = useState(0);
  const [quality, setQuality] = useState(0);
  const [performance, setPerformance] = useState(0);
  const [durability, setDurability] = useState(0);
  const [review, setReview] = useState("");
  const [image, setImage] = useState("");
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgErr, setImgErr] = useState("");
  const [current, setCurrent] = useState("");
  const [product_images, setProduct_images] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    var products = [];
    firebase
      .firestore()
      .collection("products")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          products.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setProducts(products);
        setSearchedProducts(products);
        setLoading(false);
      });
  };

  const handleImagePicker = (e) => {
    var arr = e.target.files[0];
    if (arr.size < 350000) {
      setImage(arr);
      setImgErr("");
    } else {
      setImgErr("Image size greater than 350kb are not accepted");
      setTimeout(() => {
        setImgErr("");
      }, 4000);
    }
  };

  const handleProductImagePicker = (e) => {
    var arr = e.target.files[0];
    if (arr.size < 350000 && product_images.length < 7) {
      setProduct_images([...product_images, arr]);
      setImgErr("");
    } else {
      setImgErr("Image size greater than 350kb are not accepted");
      setTimeout(() => {
        setImgErr("");
      }, 4000);
    }
  };

  const removeImg = (ind) => {
    setProduct_images(product_images.filter((_, index) => index !== ind));
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value !== "") {
      var searchedProducts = [];
      products.forEach((product) => {
        if (product.title.includes(e.target.value)) {
          searchedProducts.push(product);
        }
      });
      setSearchedProducts(searchedProducts);
    } else {
      setSearchedProducts(products);
    }
  };

  const handleImageUpload = async (image) => {
    var url = "";
    const storageRef = firebase
      .storage()
      .ref(`/ratings/${moment().format("DMMYYYY, h:mm:ss:SSS")}`);
    await storageRef
      .put(image)
      .then(async (res) => (url = await res.ref.getDownloadURL()));
    return url;
  };

  const handleAdd = async () => {
    setUploading(true);
    if (userName.length > 0 && review.length > 0 && image.name) {
      var img = await handleImageUpload(image);
      firebase
        .firestore()
        .collection("products")
        .doc(current)
        .get()
        .then(async (doc) => {
          var ratings = doc.data().ratings;
          var images = [];
          if (product_images.length > 0) {
            for (var i = 0; i < product_images.length; i++) {
              var url = await handleImageUpload(product_images[i], true);
              images.push(url);
            }
          }
          ratings.push({
            name: userName,
            date: new Date(),
            image: img,
            review: review,
            product_images: images,
            value_for_money: value_for_money,
            quality: quality,
            packaging: packaging,
            performance: performance,
            durability: durability,
            rate:
              (value_for_money +
                quality +
                packaging +
                durability +
                performance) /
              5,
          });
          firebase
            .firestore()
            .collection("products")
            .doc(doc.id)
            .update({
              ratings: ratings,
            })
            .then(() => {
              toaster.notify("Ratings added!");
              setUploading(false);
              setImage("");
              setValue_for_money(0);
              setQuality(0);
              setPackaging(0);
              setPerformance(0);
              setDurability(0);
              setReview("");
              setUserName("");
              setModal(false);
              init();
              setActive(false);
              setProduct_images([]);
            })
            .catch((err) => {
              console.log(err);
              toaster.notify("Something went wrong, Please try again!");
              setUploading(false);
            });
        })
        .catch((err) => {
          console.log(err);
          toaster.notify("Something went wrong, Please try again!");
          setUploading(false);
        });
    } else {
      if (userName.length === 0) {
        toaster.notify("Please enter name!");
        setUploading(false);
      } else if (review.length === 0) {
        toaster.notify("Please enter Reiew!!");
        setUploading(false);
      } else {
        toaster.notify("Please select an Image!");
        setUploading(false);
      }
    }
  };

  const handleDelete = (index) => {
    setUploading(true);
    var r = ratings;
    var deleteItem = r.splice(index, 1)[0];
    var img = deleteItem[0].image;
    firebase
      .firestore()
      .collection("products")
      .doc(current)
      .update({
        ratings: r,
      })
      .then(() => {
        init();
        setActive(false);
        deleteItem.product_images.forEach((image) =>
          firebase.storage().refFromURL(image).delete()
        );
        firebase.storage().refFromURL(img).delete();
        setUploading(false);
      });
  };

  return (
    <div className="ratings">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="title">
            <div className="left">
              <Button
                variant="contained"
                className={active ? "back-btn active" : "back-btn"}
                onClick={() => {
                  setActive(false);
                  setCurrent("");
                }}
              >
                <i className="fas fa-arrow-left"></i>
              </Button>
              <img src={rating} alt="" />
              <h4>Ratings</h4>
            </div>
            {active && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setModal(true)}
              >
                <i className="fas fa-plus-circle"></i>Add
              </Button>
            )}
          </div>
          {!active && (
            <div className="search">
              <input
                type="text"
                placeholder="Search Product..."
                value={search}
                onChange={handleSearch}
              />
              <i className="fas fa-search"></i>
            </div>
          )}
          <div className={active ? "body slideIn" : "body"}>
            <div className="section">
              {searchedProducts.length > 0 ? (
                searchedProducts.map((product, index) => {
                  return (
                    <Card2
                      image={product.images[0].image}
                      name={product.title}
                      key={index}
                      onClick={() => {
                        setActive(true);
                        setCurrent(product.id);
                        setRatings(product.ratings);
                      }}
                    />
                  );
                })
              ) : (
                <div className="no-results">No Results Found</div>
              )}
            </div>
            <div className={active ? "section active" : "section"}>
              {ratings.length > 0 ? (
                ratings.map((rating, index) => {
                  return (
                    <Card2
                      rating={rating}
                      key={index}
                      rate
                      handleDelete={() => handleDelete(index)}
                    />
                  );
                })
              ) : (
                <div className="no-results">No Results Found</div>
              )}
            </div>
          </div>
        </>
      )}
      <Modal open={modal} onClose={() => setModal(false)}>
        <div className="modal category">
          <div className="head">
            <h4>Add Rating</h4>
            <i
              className="fas fa-times"
              onClick={() => {
                setModal(false);
                setUserName("");
                setImage("");
                setReview("");
                setValue_for_money(0);
                setQuality(0);
                setPackaging(0);
              }}
            ></i>
          </div>
          <div className="body">
            <div className="user-detail">
              <label
                htmlFor="picker"
                className={image ? "picker no-background" : "picker"}
              >
                <input
                  type="file"
                  id="picker"
                  onChange={handleImagePicker}
                  accept="image/*"
                />
                {image ? (
                  image.name ? (
                    <img src={URL.createObjectURL(image)} alt="" />
                  ) : (
                    <img src={image} alt="" />
                  )
                ) : (
                  <i className="fas fa-plus"></i>
                )}
              </label>
              <div className="name_rating">
                <TextField
                  variant="outlined"
                  size="small"
                  label="Name"
                  value={userName}
                  fullWidth
                  style={{ marginBottom: 5 }}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "5px 0",
                    marginLeft: 3,
                  }}
                >
                  <h5 style={{ fontWeight: "500", width: 120 }}>
                    Value for money:
                  </h5>
                  <Rating
                    value={value_for_money}
                    onChange={(e, value) => setValue_for_money(value)}
                    name="ratings"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "5px 0",
                    marginLeft: 3,
                  }}
                >
                  <h5 style={{ fontWeight: "500", width: 120 }}>Quality: </h5>
                  <Rating
                    value={quality}
                    onChange={(e, value) => setQuality(value)}
                    name="ratings2"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "5px 0",
                    marginLeft: 3,
                  }}
                >
                  <h5 style={{ fontWeight: "500", width: 120 }}>Packaging: </h5>
                  <Rating
                    value={packaging}
                    onChange={(e, value) => setPackaging(value)}
                    name="ratings3"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "5px 0",
                    marginLeft: 3,
                  }}
                >
                  <h5 style={{ fontWeight: "500", width: 120 }}>Durability:</h5>
                  <Rating
                    value={durability}
                    onChange={(e, value) => setDurability(value)}
                    name="ratings4"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "5px 0 10px",
                    marginLeft: 3,
                  }}
                >
                  <h5 style={{ fontWeight: "500", width: 120 }}>
                    Performance:
                  </h5>
                  <Rating
                    value={performance}
                    onChange={(e, value) => setPerformance(value)}
                    name="ratings5"
                  />
                </div>
              </div>
            </div>
            <TextField
              variant="outlined"
              size="medium"
              label="Review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="textarea"
              fullWidth
              multiline
            />
            <h5 style={{ fontWeight: "500", marginBottom: 15 }}>
              Product Images:{" "}
            </h5>
            <div className="product_images">
              {product_images.map((img, index) => (
                <div className="product_img" key={index}>
                  <img src={URL.createObjectURL(img)} alt="" />
                  <span onClick={() => removeImg(index)}>
                    <i className="fas fa-times"></i>
                  </span>
                </div>
              ))}
              {product_images.length < 6 && (
                <label htmlFor="picker2" className="picker2">
                  <input
                    type="file"
                    id="picker2"
                    onChange={handleProductImagePicker}
                    accept="image/*"
                  />

                  <i className="fas fa-plus"></i>
                </label>
              )}
            </div>
            <p className="imgErr">{imgErr}</p>
          </div>
          <div className="footer">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setModal(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdd}
              disabled={uploading}
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
      <Backdrop className="backdrop" open={uploading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Ratings;
