import React, { useEffect, useState } from "react";
import "./alert.css";
import {
  Backdrop,
  Button,
  CircularProgress,
  Modal,
  TextField,
} from "@material-ui/core";
import bell from "../../../assets/bell.png";
import firebase from "firebase";
import moment from "moment";
import toaster from "toasted-notes";
import { AlertTitle } from "@material-ui/lab";

function Alert() {
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [imgErr, setImgErr] = useState("");
  const [err, setErr] = useState({});

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    firebase
      .firestore()
      .collection("settings")
      .get()
      .then((snap) => snap.forEach((doc) => setAlerts(doc.data().alerts)));
  };

  const handleImageUpload = async (image) => {
    var url = "";
    const storageRef = firebase
      .storage()
      .ref(`/settings/alerts/${moment().format("DMMYYYY, h:mm:ss:SSS")}`);
    await storageRef
      .put(image)
      .then(async (res) => (url = await res.ref.getDownloadURL()));
    return url;
  };

  const handlePicker = (e) => {
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

  const handleAdd = async () => {
    if (title.length > 0 && content.length > 0) {
      setUploading(true);
      var el = alerts;
      var img = "";
      if (image.name) {
        img = await handleImageUpload(image);
      }
      el.push({
        title,
        content,
        image: img,
        link: link,
        date: new Date(),
      });
      firebase
        .firestore()
        .collection("settings")
        .get()
        .then((snap) => {
          snap.forEach((doc) =>
            firebase
              .firestore()
              .collection("settings")
              .doc(doc.id)
              .update({
                alerts: el,
              })
              .then(() => {
                setUploading(false);
                setModal(false);
                setTitle("");
                setContent("");
                setImage("");
                setLink("");
                init();
              })
              .catch((err) => {
                console.log(err.message);
                toaster.notify("Something went wrong, Please try again!");
              })
          );
        })
        .catch((err) => {
          console.log(err.message);
          toaster.notify("Something went wrong, Please try again!");
        });
    } else {
      var err = {};
      if (title.length === 0) {
        err.input = "title";
        err.message = "Please enter a title";
      } else {
        err.input = "content";
        err.message = "Please enter content";
      }
      setErr(err);
    }
  };

  const handleDelete = (index) => {
    setUploading(true);
    var alertsArr = alerts;
    alertsArr.splice(index, 1);
    firebase
      .firestore()
      .collection("settings")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          firebase
            .firestore()
            .collection("settings")
            .doc(doc.id)
            .update({
              alerts: alertsArr,
            })
            .then(() => {
              setUploading(false);
            });
        });
      });
  };

  return (
    <div className="alert">
      <div className="title">
        <div className="left">
          <img src={bell} alt="" />
          <h4>Alert</h4>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModal(true)}
        >
          <i className="fas fa-plus-circle"></i>Add
        </Button>
      </div>
      <div className="body">
        {alerts.map((alert, index) => {
          return (
            <div className="alert_div">
              <i
                className="fas fa-trash"
                onClick={() => handleDelete(index)}
              ></i>
              <h4>{alert.title}</h4>
              {alert.image && <img src={alert.image} alt="" />}
              <p>{alert.content}</p>
              <div className="bottom">
                <a href={alert.link}>
                  Learn More <i className="fas fa-chevron-right"></i>
                </a>
                <p className="date">
                  {moment(
                    alert.date.seconds ? alert.date.toDate() : alert.date
                  ).format("D/MM/YYYY")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Modal open={modal} onClose={() => setModal(false)}>
        <div className="modal category">
          <div className="head">
            <h4>Add Alert</h4>
            <i
              className="fas fa-times"
              onClick={() => {
                setModal(false);
                setTitle("");
                setContent("");
                setImage("");
                setLink("");
              }}
            ></i>
          </div>
          <div className="body">
            <TextField
              variant="outlined"
              size="small"
              label="Heading"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (err.input === "title") {
                  setErr({});
                }
              }}
              error={err.input === "title"}
              helperText={err.input === "title" && err.message}
            />
            <TextField
              variant="outlined"
              size="small"
              label="Content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (err.input === "content") {
                  setErr({});
                }
              }}
              style={{ margin: "20px 0" }}
              error={err.input === "content"}
              helperText={err.input === "content" && err.message}
            />
            <label htmlFor="image" className="pick">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handlePicker}
              />
              {image.name ? (
                <img src={URL.createObjectURL(image)} alt="" />
              ) : (
                <i className="fas fa-plus"></i>
              )}
            </label>
            <TextField
              variant="outlined"
              size="small"
              label="Link"
              value={link}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              style={{ margin: "20px 0" }}
            />
            <p style={{ color: "#fc5185", fontSize: 14, marginTop: 5 }}>
              {imgErr}
            </p>
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

export default Alert;
