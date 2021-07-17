import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./advertisement.css";
import { Button, Modal } from "@material-ui/core";
import firebase from "firebase";
import toaster from "toasted-notes";
import Loader from "../../loader/loader";

export default function Advertisement({ uploading, setUploading }) {
  const [editAdSection, setEditAdSection] = useState([]);
  const [adModal, setAdModal] = useState(false);
  const [adSection, setAdSection] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [imgErr, setImgErr] = useState("");
  const [editSlider, setEditSlider] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);

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
      setEditAdSection([...editAdSection, img]);
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

  const updateImages = async () => {
    setUploading(true);
    var images = [];
    for (let i = 0; i < editAdSection.length; i++) {
      if (editAdSection[i].name) {
        var url = await handleImageUpload(editAdSection[i], "addSection");
        images.push(url);
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
        removedImages.forEach((img) =>
          firebase.storage().refFromURL(img).delete()
        );
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
    setRemovedImages([...removedImages, removedimg[0]]);
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
                <div className="slide" key={index}>
                  <img src={item} alt="" />
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
                      {item.length > 0 ? (
                        <img src={item} alt="" />
                      ) : (
                        <img src={URL.createObjectURL(item)} alt="" />
                      )}
                      <span
                        className="cross"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times"></i>
                      </span>
                    </div>
                  ))}
                  <label htmlFor="input-picker">
                    <input
                      type="file"
                      id="input-picker"
                      onChange={handleImagePicker}
                      accept="image/*"
                    />
                    <i className="fas fa-plus"></i>
                  </label>
                </Slider>
                <p className="error">{imgErr}</p>
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
        </>
      )}
    </div>
  );
}
