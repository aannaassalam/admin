import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import "./addModal.css";
import imageUploader from "../../../hooks/imageUploader";

function AddModal({ setModal, edit, editProduct }) {
  const [state, setstate] = useState({
    categories: [],
    subcategories: [],
    loading: true,
    modal: false,
    products: [],
    product: {
      name: edit ? editProduct.name : "",
      category: edit ? editProduct.category : "",
      subcategory: edit ? editProduct.subcategory : "",
      images: edit ? editProduct.images : [],
      price: edit ? editProduct.price : 50,
      highlights: edit
        ? editProduct.highlights
        : [
            { key: "Type of Fabric", value: "made of 100% cotton, unlined" },
            { key: "Size", value: "14" },
            { key: "shoulder seam to shoulder seam", value: "16” approximate" },
            { key: "sleeve length", value: "13” approximately" },
            { key: "dress length", value: "36” approximate" },
          ],
      description: edit
        ? editProduct.description
        : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      note: edit
        ? editProduct.note
        : "This item has a clean neck and armpits, no stains, no missing buttons and zippers function.",
      sold: false,
    },
    err: { input: "", msg: "" },
    imageModal: false,
    localImages: [],
  });

  const db = getFirestore();
  const collec = collection(db, "products");
  var obj = state;

  useEffect(() => {
    onSnapshot(doc(db, "settings", "dMsgyXwanQY5tnH075J0"), (doc) => {
      setstate({ ...state, categories: doc.data().categories, loading: false });
    });

    if (edit && !state.loading) {
      var arr = [];
      state.categories.forEach((item) => {
        if (item.name === state.product.category) arr = item.subcategories;
      });
      obj.subcategories = arr;
      setstate({ ...obj });
    }
  }, [state.loading]);

  const handleChange = (e) => {
    setstate({
      ...state,
      product: { ...state.product, [e.target.name]: e.target.value },
      err: { input: "", msg: "" },
    });
  };
  const handleSubmit = async () => {
    console.log(state.product);
    if (
      state.product.category &&
      state.product.subcategory &&
      state.product.name &&
      state.product.price &&
      state.product.description &&
      state.product.highlights.length > 0 &&
      state.product.images.length > 0
    ) {
      if (edit === true) {
        const docref = doc(db, "products", editProduct.id);
        const images = await imageUploader(
          state.product.images,
          editProduct.id
        );
        updateDoc(docref, {
          name: state.product.name,
          category: state.product.category,
          subcategory: state.product.subcategory,
          images: images,
          price: state.product.price,
          highlights: state.product.highlights,
          description: state.product.description,
          note: state.product.note,
        });
        setModal();
      } else {
        addDoc(collec, {
          name: state.product.name,
          category: state.product.category,
          subcategory: state.product.subcategory,
          images: [],
          price: state.product.price,
          highlights: state.product.highlights,
          description: state.product.description,
          note: state.product.note,
          sold: false,
          date: new Date(),
        })
          .then(async (returnedDoc) => {
            const images = await imageUploader(
              state.product.images,
              returnedDoc.id
            );
            updateDoc(doc(getFirestore(), "products", returnedDoc.id), {
              images: images,
            })
              .then(() => {
                console.log("added");
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    } else if (!state.product.category) {
      setstate({
        ...state,
        err: { input: "category", msg: "Please Select Category" },
      });
    } else if (!state.product.subcategory) {
      setstate({
        ...state,
        err: { input: "subcategory", msg: "Please Select subcategory" },
      });
    } else if (!state.product.name) {
      setstate({
        ...state,
        err: { input: "name", msg: "Please Enter Product Name" },
      });
    } else if (!state.product.price) {
      setstate({
        ...state,
        err: { input: "price", msg: "Please Enter Product Price" },
      });
    } else if (!state.product.description) {
      setstate({
        ...state,
        err: { input: "description", msg: "Please Enter Description" },
      });
    } else if (!state.product.highlights.length > 0) {
      setstate({
        ...state,
        err: { input: "highlights", msg: "Please Enter highlights" },
      });
    } else {
      setstate({
        ...state,
        err: { input: "images", msg: " Please Select & Upload Images" },
      });
    }
  };

  return (
    <div className="modal-backdrop">
      {state.loading ? (
        <div className="modal"></div>
      ) : (
        <div className="modal">
          <div className="modal-header">
            <h5>Add Product</h5>
            <span onClick={() => setModal(false)}>
              <i className="fa-solid fa-times"></i>
            </span>
          </div>
          <div className="modal-body">
            <div className="inputFields">
              <FormControl variant="filled">
                <InputLabel id="demo-simple-select-standard-label">
                  Product Categoy
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  className="input"
                  id="demo-simple-select-filled"
                  value={state.product.category}
                  name="category"
                  onChange={handleChange}
                >
                  {state.categories.map((item, id) => (
                    <MenuItem
                      onClick={() => {
                        var obj = state;
                        obj.subcategories = item.subcategories;
                        obj.product.subcategory = "";
                        setstate(obj);
                      }}
                      value={item.name}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {state.err.input === "category" ? state.err.msg : null}
                </FormHelperText>
              </FormControl>
              <FormControl variant="filled">
                <InputLabel id="demo-simple-select-standard-label">
                  Product Subcategory
                </InputLabel>
                {state.subcategories.length > 0 ? (
                  <>
                    <Select
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      className="input"
                      value={state.product.subcategory}
                      name="subcategory"
                      onChange={handleChange}
                    >
                      {state.subcategories.map((item) => (
                        <MenuItem value={item}>
                          {item.name} - {item.type}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {state.err.input === "subcategory" ? state.err.msg : null}
                    </FormHelperText>
                  </>
                ) : (
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    className="input"
                    value={state.product.subcategory}
                    name="subcategory"
                    onChange={handleChange}
                  >
                    <MenuItem disabled value="">
                      Select Category First
                    </MenuItem>
                  </Select>
                )}
              </FormControl>
              <TextField
                variant="filled"
                className="input"
                label="Product Name"
                value={state.product.name}
                name="name"
                onChange={handleChange}
                size="small"
                // fullWidth
                error={state.err.input === "name"}
                helperText={state.err.input === "name" && state.err.msg}
              />
              <TextField
                className="input"
                variant="filled"
                label="Product  Price"
                type="number"
                value={state.product.price}
                name="price"
                onChange={handleChange}
                size="small"
                // fullWidth
                error={state.err.input === "price"}
                helperText={state.err.input === "price" && state.err.msg}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                Note:
                <textarea
                  id=""
                  cols="30"
                  rows="7"
                  placeholder="Enter Note ( Optional )"
                  value={state.product.note}
                  name="note"
                  onChange={handleChange}
                ></textarea>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                Description:
                <textarea
                  id=""
                  cols="30"
                  rows="7"
                  placeholder="Enter Description"
                  className={state.err.input === "description" ? "error" : null}
                  value={state.product.description}
                  name="description"
                  error={state.err.input === "description"}
                  helperText={
                    state.err.input === "description" && state.err.msg
                  }
                  onChange={handleChange}
                ></textarea>
              </div>
              <div
                className="highlights"
                style={{
                  alignSelf: "flex-start",
                  maxHeight: "-webkit-fill-available",
                  // overflowY: "auto",
                }}
              >
                Highlights:
                <FormHelperText>
                  {state.err.input === "highlights" ? state.err.msg : null}
                </FormHelperText>
                <div
                  style={{
                    alignSelf: "flex-start",
                    maxHeight: "140px",
                    overflowY: "auto",
                  }}
                >
                  {state.product.highlights.map((item, id) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        // gridTemplateColumns: "1fr 1fr",
                        // gridGap: "10px",
                      }}
                    >
                      <span style={{ marginRight: 10 }}>{id + 1}</span>
                      <TextField
                        className="input"
                        variant="filled"
                        label="Key"
                        style={{ marginRight: "10px" }}
                        size="small"
                        value={item.key}
                        onChange={(e) => {
                          var arr = { ...state.product.highlights };
                          arr[id].key = e.target.value;
                          setstate({
                            ...state,
                            product: { ...state.product },
                            highlights: arr,
                          });
                        }}
                      />

                      <TextField
                        className="input"
                        variant="filled"
                        style={{ marginRight: "10px" }}
                        size="small"
                        value={item.value}
                        label="value"
                        onChange={(e) => {
                          var arr = { ...state.product.highlights };
                          arr[id].value = e.target.value;
                          setstate({
                            ...state,
                            product: { ...state.product },
                            highlights: arr,
                          });
                        }}
                      />
                      <i
                        onClick={() => {
                          var arr = state.product.highlights.filter(
                            (it, idx) => idx !== id
                          );
                          setstate({
                            ...state,
                            product: { ...state.product, highlights: arr },
                          });
                        }}
                        className="fa-solid fa-times"
                      ></i>
                    </div>
                  ))}
                </div>
                <p
                  className="add-p"
                  onClick={() => {
                    setstate({
                      ...state,
                      product: {
                        ...state.product,
                        highlights: [
                          ...state.product.highlights,
                          { key: "", value: "" },
                        ],
                      },
                      err: { input: "", msg: "" },
                    });
                  }}
                >
                  [ + Add Highlights]
                </p>
              </div>
              <div>
                <button
                  className="image-button"
                  type="button"
                  onClick={() =>
                    setstate((prev) => ({
                      ...prev,
                      imageModal: true,
                      localImages: prev.product.images,
                    }))
                  }
                >
                  Images
                </button>
                <FormHelperText>
                  {state.err.input === "images" ? state.err.msg : null}
                </FormHelperText>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="cancel"
              onClick={() => {
                setModal();
              }}
            >
              Cancel
            </button>
            <button onClick={handleSubmit} className="save">
              Save
            </button>
          </div>
        </div>
      )}
      {state.imageModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h5>Images</h5>
              <span
                onClick={() =>
                  setstate((prev) => ({
                    ...prev,
                    imageModal: false,
                    localImages: [],
                  }))
                }
              >
                <i className="fa-solid fa-times"></i>
              </span>
            </div>
            <div className="modal-body">
              <div className="images-grid">
                {state.localImages.map((image) => {
                  console.log(typeof image.image);
                  return (
                    <div className="image-div" key={image.id}>
                      <img
                        src={
                          typeof image.image === "string"
                            ? image.image
                            : URL.createObjectURL(image.image)
                        }
                        alt="Product"
                      />
                      <div className="remove-hover">
                        <span
                          onClick={() =>
                            setstate((prev) => ({
                              ...prev,
                              localImages: prev.localImages.filter(
                                (img) => img.id !== image.id
                              ),
                            }))
                          }
                        >
                          REMOVE
                        </span>
                      </div>
                    </div>
                  );
                })}
                <label className="add-image">
                  <input
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0].size > 300000) {
                        setstate((prev) => ({
                          ...prev,
                          err: {
                            input: "Image Modal",
                            msg: "Image size should not exceed 300KB",
                          },
                        }));
                      } else {
                        setstate((prev) => ({
                          ...prev,
                          localImages: [
                            ...prev.localImages,
                            {
                              image: e.target.files[0],
                              id:
                                prev.localImages[prev.localImages.length - 1]
                                  ?.id + 1 || 1,
                            },
                          ],
                          err: { input: "", msg: "" },
                        }));
                      }
                    }}
                  />
                  <i className="fa-solid fa-plus"></i>
                </label>
              </div>
              <FormHelperText>
                {state.err.input === "Image Modal" ? state.err.msg : null}
              </FormHelperText>
            </div>
            <div className="modal-footer">
              <button
                className="cancel"
                onClick={() =>
                  setstate((prev) => ({
                    ...prev,
                    imageModal: false,
                    localImages: [],
                  }))
                }
              >
                Close
              </button>
              <button
                className="save"
                onClick={() =>
                  setstate((prev) => ({
                    ...prev,
                    imageModal: false,
                    localImages: [],
                    product: {
                      ...prev.product,
                      images: prev.localImages,
                    },
                  }))
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddModal;
