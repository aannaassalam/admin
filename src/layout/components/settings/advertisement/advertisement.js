import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./advertisement.css";
import { Button, Modal, TextField } from "@material-ui/core";
import firebase from "firebase";
import toaster from "toasted-notes";
import Loader from "../../loader/loader";

export default function Advertisement({ uploading, setUploading }) {
  const [editAdSection, setEditAdSection] = useState([]);
  const [adModal, setAdModal] = useState(false);
  const [adSection, setAdSection] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [imgErr, setImgErr] = useState("");
  // const [editSlider, setEditSlider] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState(false);
  const [newImage, setNewImage] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    firebase
      .firestore()
      .collection("settings")
      .get()
      .then((snap) =>
        snap.forEach((doc) => {
          // setLoading(false);
          setAdSection(doc.data().addSection);
          setEditAdSection(doc.data().addSection);
          setId(doc.id);
          setLoading(false);
        })
      );
  };

  const setting = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleImagePicker = (e) => {
    var img = e.target.files[0];
    if (img && img.size < 350000) {
      setNewImage(img);
      setImgErr("");
    } else {
      setImgErr("Image Size greater than 350kb are not accepted");
      setTimeout(() => {
        setImgErr("");
      }, 4000);
    }
  };

  const handleImageUpload = async (image, doc) => {
    var url = "";
    var num = Math.floor(Math.random() * 900);
    const storageRef = firebase.storage().ref(`/settings/${doc}/${num}`);
    await storageRef
      .put(image)
      .then(async (res) => (url = await res.ref.getDownloadURL()));
    return url;
  };

  const addImages = () => {
    setEditAdSection([...editAdSection, { image: newImage, link: link }]);
    setImageModal(false);
    setNewImage("");
    setLink("");
  };

  const updateImages = async () => {
    setUploading(true);
    var images = [];
    for (let i = 0; i < editAdSection.length; i++) {
      if (editAdSection[i].image.name) {
        var url = await handleImageUpload(editAdSection[i].image, "addSection");
        images.push({ image: url, link: editAdSection[i].link });
        // images[i].image = url;
      } else {
        images.push(editAdSection[i]);
      }
    }
    firebase
      .firestore()
      .collection("settings")
      .doc(id)
      .update({
        addSection: images,
      })
      .then(() => {
        removedImages.forEach((img) => {
          if (!img.name) {
            firebase.storage().refFromURL(img).delete();
          }
        });
        init();
        setUploading(false);
        setRemovedImages([]);
        setAdModal(false);
        toaster.notify("Advertisement Banner updated...");
      })
      .catch((err) => {
        toaster.notify("Something went wrong!");
        setUploading(false);
      });
  };

  const removeImage = (index) => {
    var images = editAdSection;
    var removedimg = images.splice(index, 1);
    setEditAdSection(images);
    setRemovedImages([...removedImages, removedimg[0].image]);
  };
  return (
    <div className="advertisement">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="heading">
            <h2>Advertisement</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAdModal(true)}
            >
              Edit
            </Button>
          </div>
          <div className="slider">
            <Slider {...setting}>
              {adSection.map((item, index) => (
                <div
                  className="slide"
                  key={index}
                  onClick={() => window.open(item.link)}
                >
                  <img src={item.image} alt="" />
                </div>
              ))}
            </Slider>
          </div>
          <Modal
            open={adModal}
            onClose={() => (uploading ? null : setAdModal(false))}
          >
            <div className="imagesModal">
              <div className="head">
                <h4>Edit Banner Images</h4>
                <i
                  className="fas fa-times"
                  onClick={() => (uploading ? null : setAdModal(false))}
                ></i>
              </div>
              <div className="body">
                <Slider {...setting} className="adSlider">
                  {editAdSection.map((item, index) => (
                    <div className="addSlide" key={index}>
                      {!item.image.name ? (
                        <img src={item.image} alt="" />
                      ) : (
                        <img src={URL.createObjectURL(item.image)} alt="" />
                      )}
                      <span
                        className="cross"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times"></i>
                      </span>
                      <p style={{ margin: "15px 0 30px" }}>{item.link}</p>
                    </div>
                  ))}
                  <label onClick={() => setImageModal(true)}>
                    <i className="fas fa-plus"></i>
                  </label>
                </Slider>
              </div>
              <div className="footer">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setAdModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={updateImages}
                  disabled={uploading}
                >
                  Update
                </Button>
              </div>
            </div>
          </Modal>
          <Modal open={imageModal} onClose={() => setImageModal(false)}>
            <div className="new">
              <label className="input-picker" htmlFor="input-picker">
                {newImage.name ? (
                  <img src={URL.createObjectURL(newImage)} alt="" />
                ) : (
                  <i className="fas fa-plus"></i>
                )}
                <input
                  type="file"
                  id="input-picker"
                  onChange={handleImagePicker}
                  accept="image/*"
                />
              </label>
              <TextField
                variant="outlined"
                size="small"
                value={link}
                label="Link"
                onChange={(e) => setLink(e.target.value)}
                fullWidth
              />
              <p className="error">{imgErr}</p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  type="small"
                  color="primary"
                  onClick={() => setImageModal(false)}
                  style={{ marginRight: 20 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="small"
                  color="primary"
                  onClick={addImages}
                >
                  Add
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
