import React, { useEffect, useState } from "react";
import "./categories.css";
import firebase from "firebase";
import category from "../../../assets/categories.png";
import {
  Backdrop,
  Button,
  Modal,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import CategoryCard from "../../components/category-card/category-card";
import Loader from "../../components/loader/loader";
import toaster from "toasted-notes";

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docID, setDocID] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [imgErr, setImgErr] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [active, setActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [subIndex, setSubIndex] = useState(-1);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    firebase
      .firestore()
      .collection("settings")
      .get()
      .then((snap) =>
        snap.forEach(async (doc) => {
          setDocID(doc.id);
          setCategories(doc.data().categories);
          setLoading(false);
        })
      );
  };

  const handleImageUpload = async (image, name) => {
    var url = "";
    const storageRef = firebase.storage().ref(`/settings/${name}`);
    await storageRef
      .put(image)
      .then(async (res) => (url = await res.ref.getDownloadURL()));
    return url;
  };

  const handleImagePicker = (e) => {
    var arr = e.target.files[0];
    if (arr.size < 350000) {
      setImage(arr);
      setImgErr("");
    } else {
      setImgErr("Image Size greater than 350kb are not accepted");
      setTimeout(() => {
        setImgErr("");
      }, 4000);
    }
  };

  const handleDelete = (name) => {
    var img = "";
    var categories2 = categories;
    var newCategories = [];
    var newSubCategories = [];
    setUploading(true);
    categories.forEach((cat, index) => {
      if (active) {
        cat.subcategories.forEach((sub) => {
          if (sub.name === name) {
            img = sub.image;
          } else {
            if (index === categoryIndex) {
              newSubCategories.push(sub);
            }
          }
        });
        categories2[categoryIndex].subcategories = newSubCategories;
      } else {
        if (cat.name === name) {
          img = cat.image;
        } else {
          newCategories.push(cat);
        }
      }
    });
    firebase
      .firestore()
      .collection("settings")
      .doc(docID)
      .update({
        categories: active ? categories2 : newCategories,
      })
      .then(() => {
        firebase
          .storage()
          .refFromURL(img)
          .delete()
          .then(() => {
            setUploading(false);
            init();
            setSubCategories(
              active
                ? categories[categoryIndex]?.subcategories
                : categories[0]?.subcategories
            );
          })
          .catch((err) => {
            console.log(err.message);
            setUploading(false);
          });
      })
      .catch(() => {
        toaster.notify("Something went wrong, Please try again!");
        setUploading(false);
      });
  };

  const handleAdd = async () => {
    setUploading(true);
    var found = false;
    if (image.name && name.length > 0) {
      categories.forEach((item) => {
        item.subcategories.forEach((sub) => {
          if (sub.name === name || item.name === name) {
            found = true;
          }
        });
      });
    } else {
      if (!image.name) {
        toaster.notify(
          `Please select a ${active ? "Subcategory" : "Category"} image!`
        );
      } else {
        toaster.notify(
          `Please enter ${active ? "Subcategory" : "Category"} name!`
        );
      }
    }
    if (!found) {
      var img = await handleImageUpload(image, name);
      var newCategories = [];
      if (active) {
        var newSubcategories = [
          ...subCategories,
          { active: true, image: img, name: name },
        ];
        var activeCat = activeCategory;
        activeCat.subcategories = newSubcategories;
        newCategories = categories;
        newCategories[categoryIndex] = activeCat;
      } else {
        newCategories = [
          ...categories,
          { active: true, image: img, name: name, subcategories: [] },
        ];
      }
      firebase
        .firestore()
        .collection("settings")
        .doc(docID)
        .update({
          categories: newCategories,
        })
        .then(() => {
          toaster.notify(`${name} added successfully`);
          setName("");
          setImage("");
          setUploading(false);
          setOpen(false);
          init();
          setSubCategories(
            categories.length > 0
              ? active
                ? categories[categoryIndex].subcategories
                : categories[0].subcategories
              : []
          );
        })
        .catch((err) => {
          console.log(err.message);
          toaster.notify("Something went wrong, Please try again!");
          setUploading(false);
          setOpen(false);
        });
    } else {
      toaster.notify("Item with same name already exists!");
      setUploading(false);
    }
  };

  const handleEdit = async () => {
    setUploading(true);
    var found = false;
    var c = 0;
    if ((image.name || image.includes("https://")) && name.length > 0) {
      categories.forEach(
        (item) => {
          item.subcategories.forEach((sub) => {
            if (sub.name === name || item.name === name) {
              c++;
            }
          });
        },
        c > 1 ? (found = true) : null
      );
    } else {
      if (!image.name) {
        toaster.notify(
          `Please select a ${active ? "Subcategory" : "Category"} image!`
        );
      } else {
        toaster.notify(
          `Please enter ${active ? "Subcategory" : "Category"} name!`
        );
      }
    }
    if (!found) {
      var img = "";
      if (image.name) {
        if (active) {
          firebase
            .storage()
            .refFromURL(activeCategory.subcategories[subIndex].image)
            .delete()
            .catch((err) => {
              console.log(err.message);
              setUploading(false);
            });
        } else {
          firebase
            .storage()
            .refFromURL(activeCategory.image)
            .delete()
            .catch((err) => {
              console.log(err.message);
              setUploading(false);
            });
        }
        img = await handleImageUpload(image, name);
      } else {
        img = image;
      }
      var newCategories = categories;
      if (active) {
        var activeCat = activeCategory;
        activeCat.subcategories[subIndex].name = name;
        activeCat.subcategories[subIndex].image = img;
        newCategories[categoryIndex] = activeCat;
      } else {
        newCategories[categoryIndex].name = name;
        newCategories[categoryIndex].image = img;
      }
      firebase
        .firestore()
        .collection("settings")
        .doc(docID)
        .update({
          categories: newCategories,
        })
        .then(() => {
          toaster.notify(`${name} updated successfully`);
          setName("");
          setImage("");
          setUploading(false);
          setOpen(false);
          init();
          setEdit(false);
          setSubCategories(
            active
              ? categories[categoryIndex].subcategories
              : categories[0].subcategories
          );
        })
        .catch((err) => {
          toaster.notify("Something went wrong, Please try again!");
          setUploading(false);
          setOpen(false);
        });
    } else {
      toaster.notify("Item with same name already exists!");
      setUploading(false);
    }
  };

  return (
    <div className="categories">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="title">
            <div className="left">
              <Button
                variant="contained"
                className={active ? "back-btn active" : "back-btn"}
                onClick={() => setActive(false)}
              >
                <i className="fas fa-arrow-left"></i>
              </Button>
              <img src={category} alt="" />
              <h4>Add New {active ? "Subcategory" : "Category"}</h4>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              <i className="fas fa-plus-circle"></i>Add
            </Button>
          </div>
          <div className={active ? "body slideIn" : "body"}>
            <div className="section">
              {categories.map((item, index) => (
                <CategoryCard
                  img={item.image}
                  name={item.name}
                  key={index}
                  handleDelete={() => handleDelete(item.name)}
                  handleEdit={() => {
                    setOpen(true);
                    setEdit(true);
                    setName(item.name);
                    setImage(item.image);
                    setActiveCategory(item);
                    setCategoryIndex(index);
                  }}
                  setSubCategories={() => {
                    setSubCategories(item.subcategories);
                    setActiveCategory(item);
                    setActive(true);
                    setCategoryIndex(index);
                  }}
                />
              ))}
            </div>
            <div className={active ? "section active" : "section"}>
              {subCategories.map((item, index) => (
                <CategoryCard
                  img={item.image}
                  name={item.name}
                  key={index}
                  handleEdit={() => {
                    setOpen(true);
                    setEdit(true);
                    setName(item.name);
                    setImage(item.image);
                    setSubIndex(index);
                  }}
                  handleDelete={() => handleDelete(item.name)}
                  uploading={uploading}
                />
              ))}
            </div>
          </div>
          <Modal open={open} onClose={() => setOpen(false)}>
            <div className="modal category">
              <div className="head">
                <h4>{`${edit ? "Edit" : "Add"} New Category`}</h4>
                <i
                  className="fas fa-times"
                  onClick={() => {
                    setOpen(false);
                    setEdit(false);
                    setName("");
                    setImage("");
                  }}
                ></i>
              </div>
              <div className="body">
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
                <TextField
                  variant="outlined"
                  size="small"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="imgErr">{imgErr}</p>
              </div>
              <div className="footer">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={edit ? handleEdit : handleAdd}
                  disabled={uploading}
                >
                  {edit ? "Edit" : "Upload"}
                </Button>
              </div>
            </div>
          </Modal>
          <Backdrop className="backdrop" open={uploading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
    </div>
  );
}
