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
function AddModal({ setModal, edit, editProduct }) {
  const [state, setstate] = useState({
    categories: [],
    subCategories: [],
    loading: true,
    modal: false,
    products: [],
    product: {
      name: edit ? editProduct.name : "",
      category: edit ? editProduct.category : "",
      subCategory: edit ? editProduct.subCategory : "",
      images: edit ? editProduct.images : [],
      price: edit ? editProduct.price : "",
      highlights: edit ? editProduct.highlights : [],
      description: edit ? editProduct.description : "",
      note: edit ? editProduct.note : "",
      type: edit ? editProduct.type : null,
      sold: false,
    },
    err: { input: "", msg: "" },
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
      obj.subCategories = arr;
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
  const handleSubmit = () => {
    console.log(state.product);
    if (
      state.product.category &&
      state.product.subCategory &&
      state.product.name &&
      state.product.price &&
      state.product.description &&
      state.product.highlights.length > 0
    ) {
      if (edit === true) {
        const docref = doc(db, "products", editProduct.id);
        updateDoc(docref, {
          name: state.product.name,
          category: state.product.category,
          subCategory: state.product.subCategory,
          images: [],
          price: state.product.price,
          highlights: state.product.highlights,
          description: state.product.description,
          note: state.product.note,
          type: state.product.type,
        });
        setModal();
      } else {
        addDoc(collec, {
          name: state.product.name,
          category: state.product.category,
          subCategory: state.product.subCategory,
          images: [],
          price: state.product.price,
          highlights: state.product.highlights,
          description: state.product.description,
          note: state.product.note,
          type: state.product.type,
          sold: false,
          date: new Date(),
        })
          .then(() => {
            console.log("added");
          })
          .catch((err) => console.log(err));
      }
    } else if (!state.product.category) {
      setstate({
        ...state,
        err: { input: "category", msg: "Select Category" },
      });
    } else if (!state.product.subCategory) {
      setstate({
        ...state,
        err: { input: "subCategory", msg: "Select subCategory" },
      });
    } else if (!state.product.name) {
      setstate({
        ...state,
        err: { input: "name", msg: "Enter Product Name" },
      });
    } else if (!state.product.price) {
      setstate({
        ...state,
        err: { input: "price", msg: "Enter Product Price" },
      });
    } else if (!state.product.description) {
      setstate({
        ...state,
        err: { input: "description", msg: "Enter Description" },
      });
    } else if (!state.product.highlights.length > 0) {
      setstate({
        ...state,
        err: { input: "highlights", msg: "Enter highlights" },
      });
    }
  };
  return (
    <div className="addmodal-backdrop">
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
                      obj.subCategories = item.subcategories;
                      obj.product.subCategory = "";
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
                Product SubCategory
              </InputLabel>
              {state.subCategories.length > 0 ? (
                <>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    className="input"
                    value={state.product.subCategory}
                    name="subCategory"
                    onChange={handleChange}
                  >
                    {state.subCategories.map((item) => (
                      <MenuItem
                        onClick={() => {
                          var obj = state.product;
                          obj.type = item.type;
                          setstate({
                            ...state,
                            product: obj,
                          });
                        }}
                        value={item.name}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {state.err.input === "subCategory" ? state.err.msg : null}
                  </FormHelperText>
                </>
              ) : (
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  className="input"
                  value={state.product.subCategory}
                  name="subCategory"
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
                rows="10"
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
                rows="10"
                placeholder="Enter Description"
                className={state.err.input === "description" ? "error" : null}
                value={state.product.description}
                name="description"
                error={state.err.input === "description"}
                helperText={state.err.input === "description" && state.err.msg}
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
              <button
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
                [ Add Highlights]
              </button>
            </div>
            <div className="buttons">
              <Button onClick={handleSubmit}>Save</Button>
              <Button
                onClick={() => {
                  setModal();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddModal;
