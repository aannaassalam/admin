import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
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
  getDoc,
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
    sizesOption: edit ? (editProduct?.sizes?.length > 0 ? true : false) : false,
    varianceOption: edit
      ? editProduct.variances?.length > 0
        ? true
        : false
      : false,
    subcategories: [],
    loading: true,
    modal: false,
    products: [],
    product: {
      name: edit ? editProduct.name : "",
      category: edit ? editProduct.category : "",
      subcategory: edit ? editProduct.subcategory.id : "",
      images: edit ? editProduct.images : [],
      mprice: edit ? editProduct.markedPrice : 50,
      skuId: edit ? editProduct.skuId : "",
      sprice: edit ? editProduct.sellingPrice : 30,
      sizes: edit
        ? editProduct?.sizes
        : [
            { name: "XS", quantity: 5 },
            { name: "S", quantity: 2 },
            { name: "M", quantity: 8 },
            { name: "L", quantity: 9 },
            { name: "XL", quantity: 10 },
          ],
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
  const [variances, setVariances] = useState([]);
  const db = getFirestore();
  const collec = collection(db, "products");
  var obj = state;
  console.log(state.product.subcategory);
  useEffect(() => {
    onSnapshot(doc(db, "settings", "dMsgyXwanQY5tnH075J0"), (doc) => {
      setstate({ ...state, categories: doc.data().categories, loading: false });
    });

    if (edit && !state.loading) {
      var arr = [];
      state.categories.forEach((item) => {
        if (item.name.toLowerCase() === state.product.category.toLowerCase())
          arr = item.subcategories;
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
      state.product.mprice &&
      state.product.sprice &&
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
        let arr=[...variances]
        arr.forEach(async(item,id)=>{
          arr[id].images=await imageUploader(
            item.images,
            editProduct.id
          )
        })
        setVariances(arr)
        console.log(variances)
        updateDoc(docref, {
          name: state.product.name,
          category: state.product.category,
          subcategory: state.subcategories.find(
            (item) => item.id === state.product.subcategory
          ),
          images: images,
          skuId: state.product.skuId||"",
          markedPrice: state.product.mprice,
          sellingPrice: state.product.sprice,
          highlights: state.product.highlights,
          sizes: state.sizesOption ? state.product.sizes : [],
          description: state.product.description,
          note: state.product.note,
        });
        setModal();
      } else {
        addDoc(collec, {
          name: state.product.name,
          category: state.product.category,
          subcategory: state.subcategories.find(
            (item) => item.id === state.product.subcategory
          ),
          images: [],
          skuId: state.product.skuId||"",
          markedPrice: state.product.mprice,
          sellingPrice: state.product.sprice,
          highlights: state.product.highlights,
          sizes: state.sizesOption ? state.product.sizes : [],
          description: state.product.description,
          note: state.product.note,
          sold: false,
          variances:  [],
          status: 1,
          date: new Date(),
        })
          .then(async (returnedDoc) => {
            const images = await imageUploader(
              state.product.images,
              returnedDoc.id
            );
            console.log(returnedDoc.data);
              updateDoc(doc(getFirestore(), "products", returnedDoc.id), {
              images: images,
            })
              .then(() => {
                console.log("images added");
              })
              .catch((err) => console.log(err));
            let arr=[...variances]
            arr.forEach(async(item,id)=>{
              arr[id].images=await imageUploader(
                item.images,
                returnedDoc.id
              );
             await addDoc(collection(getFirestore(),"variances"),{
                skuId:arr[id].skuId,
                productId:returnedDoc.id,
                sellingPrice:arr[id].sellingPrice,
                markedPrice:arr[id].markedPrice,
                images:arr[id].images,
                sizes:arr[id].sizes
              }).then(async(variant)=>{
                console.log("variance added");
               await getDoc(doc(getFirestore(),"products",returnedDoc.id))
               .then( docc=>{
                updateDoc(doc(getFirestore(), "products", returnedDoc.id), {
                    variances:[...docc.data().variances,variant.id]
                  }).then(console.log("id added"))
                })
              })
              console.log(arr);
            });
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
    } else if (!state.product.mprice) {
      setstate({
        ...state,
        err: { input: "mprice", msg: "Please Enter Product Marked Price" },
      });
    } else if (!state.product.sprice) {
      setstate({
        ...state,
        err: { input: "sprice", msg: "Please Enter Product Selling Price" },
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
  console.log(variances);
  console.log(state.product)
  return (
    <div className="Products">
      {state.loading ? (
        <div className="modal"></div>
      ) : (
        <div className="addProduct">
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
                      value={item.name.toLowerCase()}
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
                        <MenuItem value={item.id.toLowerCase()}>
                          {item.name}
                          {item.type && " - " + item.type}
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
              />{" "}
              <TextField
                className="input"
                variant="filled"
                label="Sku Id"
                type="text"
                value={state.product.skuId}
                name="skuId"
                onChange={handleChange}
                size="small"
                // fullWidth
                // error={state.err.input === "price"}
                // helperText={state.err.input === "price" && state.err.msg}
              />
              <TextField
                className="input"
                variant="filled"
                label="Product Marked Price"
                type="number"
                value={state.product.mprice}
                name="mprice"
                onChange={handleChange}
                size="small"
                // fullWidth
                error={state.err.input === "mprice"}
                helperText={state.err.input === "mprice" && state.err.msg}
              />
              <TextField
                className="input"
                variant="filled"
                label="Product Selling Price"
                type="number"
                value={state.product.sprice}
                name="sprice"
                onChange={handleChange}
                size="small"
                // fullWidth
                error={state.err.input === "sprice"}
                helperText={state.err.input === "sprice" && state.err.msg}
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
                    // maxHeight: "140px",
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
                          var arr = [...state.product.highlights];
                          arr[id].key = e.target.value;
                          setstate({
                            ...state,
                            product: { ...state.product, highlights: arr },
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
                          var arr = [...state.product.highlights];
                          arr[id].value = e.target.value;
                          setstate({
                            ...state,
                            product: { ...state.product, highlights: arr },
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
              {/* {sizes} */}
              {state.sizesOption ? (
                <div
                  className="highlights"
                  style={{
                    alignSelf: "flex-start",
                    // overflowY: "auto",
                  }}
                >
                  Sizes:
                  <FormHelperText>
                    {state.err.input === "sizes" ? state.err.msg : null}
                  </FormHelperText>
                  <div
                    style={{
                      alignSelf: "flex-start",
                      // maxHeight: "140px",
                      overflowY: "auto",
                    }}
                  >
                    {state.product.sizes.map((item, id) => (
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
                          label="Name"
                          placeholder="Eg:XL"
                          style={{ marginRight: "10px" }}
                          size="small"
                          value={item.name}
                          onChange={(e) => {
                            var arr = [...state.product.sizes];
                            arr[id].name = e.target.value;
                            setstate({
                              ...state,
                              product: { ...state.product, sizes: arr },
                            });
                          }}
                        />

                        <TextField
                          className="input"
                          type="number"
                          variant="filled"
                          style={{ marginRight: "10px" }}
                          size="small"
                          value={item.quantity}
                          label="Quantity"
                          onChange={(e) => {
                            console.log(typeof e.target.value);
                            var arr = [...state.product.sizes];
                            arr[id].quantity = parseInt(e.target.value);
                            setstate({
                              ...state,
                              product: { ...state.product, sizes: arr },
                            });
                          }}
                        />
                        <i
                          onClick={() => {
                            var arr = state.product.sizes.filter(
                              (it, idx) => idx !== id
                            );
                            setstate({
                              ...state,
                              product: { ...state.product, sizes: arr },
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
                          sizes: [
                            ...state.product.sizes,
                            { name: "", quantity: null },
                          ],
                        },
                        err: { input: "", msg: "" },
                      });
                    }}
                  >
                    [ + Add Size]
                  </p>
                  <FormControlLabel
                    // style={{marginLeft:"auto"}}
                    control={
                      <Checkbox
                        checked={state.sizesOption}
                        onChange={() =>
                          setstate({ ...state, sizesOption: false })
                        }
                      />
                    }
                    label="Add Sizes"
                  />
                </div>
              ) : (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.sizesOption}
                      onChange={() =>
                        setstate({ ...state, sizesOption: !state.sizesOption })
                      }
                    />
                  }
                  label="Add Sizes"
                />
              )}
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
            {state.varianceOption ? (
              <div className="variances">
                <h2 style={{ color: "#fff" }}>Variances</h2>
                <FormControlLabel
                  style={{ color: "#fff" }}
                  control={
                    <Checkbox
                      checked={state.varianceOption}
                      onChange={() =>
                        setstate({
                          ...state,
                          varianceOption: !state.varianceOption,
                        })
                      }
                    />
                  }
                  label="Add Variance"
                />
                {variances.map((item, id) => (
                  <div className="variance">
                    <h2
                      style={{
                        color: "#fff",
                        marginBottom: 20,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {`#${id + 1}`}
                      <i
                        onClick={() => {
                          var arr = variances.filter((it, idx) => idx !== id);
                          setVariances(arr);
                        }}
                        className="fa-solid fa-times"
                      ></i>
                    </h2>
                    <div className="innerVariance">
                      <TextField
                        className="input"
                        variant="filled"
                        label="Sku Id"
                        type="text"
                        value={item.skuId}
                        name="skuId"
                        onChange={(e) => {
                          let arr = [...variances];
                          arr[id].skuId = e.target.value;
                          setVariances(arr);
                        }}
                        size="small"
                        // fullWidth
                        // error={state.err.input === "price"}
                        // helperText={state.err.input === "price" && state.err.msg}
                      />
                      <TextField
                        className="input"
                        variant="filled"
                        label="Product Marked Price"
                        type="number"
                        value={item.markedPrice}
                        name="mprice"
                        onChange={(e) => {
                          let arr = [...variances];
                          arr[id].markedPrice = parseInt(e.target.value);
                          setVariances(arr);
                        }}
                        size="small"
                        // fullWidth
                        error={state.err.input === "mprice"}
                        helperText={
                          state.err.input === "mprice" && state.err.msg
                        }
                      />
                      <TextField
                        className="input"
                        variant="filled"
                        label="Product Selling Price"
                        type="number"
                        value={item.sellingPrice}
                        name="sprice"
                        onChange={(e) => {
                          let arr = [...variances];
                          arr[id].sellingPrice = parseInt(e.target.value);
                          setVariances(arr);
                        }}
                        size="small"
                        // fullWidth
                        error={state.err.input === "sprice"}
                        helperText={
                          state.err.input === "sprice" && state.err.msg
                        }
                      />
                    </div>
                    <div className="bottomPart">
                      <div className="images">
                        <h2 style={{ color: "#fff", marginBottom: 20 }}>
                          Images
                        </h2>
                        <FormHelperText>
                          {state.err.input === "Image Modal"
                            ? state.err.msg
                            : null}
                        </FormHelperText>
                        <div className="images-grid">
                          {item.images.map((image) => {
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
                                      // setstate((prev) => ({
                                      //   ...prev,
                                      //   localImages: prev.localImages.filter(
                                      //     (img) => img.id !== image.id
                                      //   ),
                                      // }))
                                      {
                                        let arr = [...variances];
                                        arr[id].images = arr[id].images.filter(
                                          (img) => img.id !== image.id
                                        );
                                        setVariances(arr);
                                      }
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
                                  let arr = [...variances];
                                  arr[id].images = [
                                    ...arr[id].images,
                                    {
                                      image: e.target.files[0],
                                      id:
                                        arr[id].images[
                                          arr[id].images.length - 1
                                        ]?.id + 1 || 1,
                                    },
                                  ];
                                  setVariances(arr);
                                  setstate((prev) => ({
                                    ...prev,
                                    err: {
                                      input: "",
                                      msg: "",
                                    },
                                  }));
                                }
                              }}
                            />
                            <i className="fa-solid fa-plus"></i>
                          </label>
                        </div>
                      </div>
                      {item.sizesOption ? (
                        <div
                          className="highlights"
                          style={{
                            alignSelf: "flex-start",
                            marginLeft: "20px",
                            // overflowY: "auto",
                          }}
                        >
                          Sizes:
                          <FormHelperText>
                            {state.err.input === "sizes" ? state.err.msg : null}
                          </FormHelperText>
                          <div
                            style={{
                              alignSelf: "flex-start",
                              // maxHeight: "140px",
                              overflowY: "auto",
                            }}
                          >
                            {item.sizes.map((size, idx) => (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: 10,
                                  // gridTemplateColumns: "1fr 1fr",
                                  // gridGap: "10px",
                                }}
                              >
                                <span style={{ marginRight: 10 }}>
                                  {idx + 1}
                                </span>
                                <TextField
                                  className="input"
                                  variant="filled"
                                  label="Name"
                                  placeholder="Eg:XL"
                                  style={{ marginRight: "10px" }}
                                  size="small"
                                  value={size.name}
                                  onChange={(e) => {
                                    var arr = [...variances];
                                    arr[id].sizes[idx].name = e.target.value;
                                    setVariances(arr);
                                  }}
                                />

                                <TextField
                                  className="input"
                                  type="number"
                                  variant="filled"
                                  style={{ marginRight: "10px" }}
                                  size="small"
                                  value={size.quantity}
                                  label="Quantity"
                                  onChange={(e) => {
                                    console.log(typeof e.target.value);
                                    var arr = [...variances];
                                    arr[id].sizes[idx].quantity = parseInt(
                                      e.target.value
                                    );
                                    setVariances(arr);
                                  }}
                                />
                                <i
                                  onClick={() => {
                                    var arr = [...variances];
                                     arr[id].sizes = arr[id].sizes.filter(
                                      (it, idxx) => idxx !== idx
                                    );
                                    setVariances(arr)
                                  }}
                                  className="fa-solid fa-times"
                                ></i>
                              </div>
                            ))}
                          </div>
                          <p
                            className="add-p"
                            onClick={() => {
                              let arr = [...variances];
                              arr[id].sizes = [
                                ...arr[id].sizes,
                                { name: "", quantity: null },
                              ];
                              setVariances(arr);
                            }}
                          >
                            [ + Add Size]
                          </p>
                          <FormControlLabel
                            // style={{marginLeft:"auto"}}
                            control={
                              <Checkbox
                                checked={item.sizesOption}
                                onChange={() => {
                                  let arr = [...variances];
                                  arr[id].sizesOption = !arr[id].sizesOption;
                                  setVariances(arr);
                                }}
                              />
                            }
                            label="Add Sizes"
                          />
                        </div>
                      ) : (
                        <FormControlLabel
                          // style={{marginLeft:"auto"}}
                          control={
                            <Checkbox
                              checked={item.sizesOption}
                              onChange={() => {
                                let arr = [...variances];
                                arr[id].sizesOption = !arr[id].sizesOption;
                                setVariances(arr);
                              }}
                            />
                          }
                          label="Add Sizes"
                        />
                      )}
                    </div>
                  </div>
                ))}
                <p
                  className="add-p"
                  onClick={() => {
                    setVariances([
                      ...variances,
                      {
                        skuId: "",
                        images: [],
                        markedPrice: "",
                        sellingPrice: "",
                        sizes: [],
                        sizesOption: false,
                      },
                    ]);
                  }}
                >
                  [ + Add Variance]
                </p>
              </div>
            ) : (
              <FormControlLabel
                style={{ color: "#fff" }}
                control={
                  <Checkbox
                    checked={state.varianceOption}
                    onChange={() => {
                      setstate({
                        ...state,
                        varianceOption: !state.varianceOption,
                      });
                    }}
                  />
                }
                label="Add Variance"
              />
            )}
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
