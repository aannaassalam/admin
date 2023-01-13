import React, { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import DeleteModal from "../../components/delete-modal/delete-modal";
import "./products.css";
import moment from "moment";
import AddModal from "./addModal/addModal";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
function Products() {
  const [state, setstate] = useState({
    modal: false,
    products: [],
    showProducts: [],
    edit: false,
    delete: false,
    editProduct: {},
    deleteProduct: {},
    option: "All",
  });
  const db = getFirestore();
  const collectionRef = collection(db, "products");
  useEffect(() => {
    onSnapshot(collectionRef, (snap) => {
      var arr = [];
      var prod = {};
      snap.docs.forEach((doc) => {
        prod = doc.data();
        prod.id = doc.id;
        arr.push(prod);
      });
      setstate({ ...state, products: arr, showProducts: arr });
    });
  }, []);
  const handleChange = (e) => {
    setstate(
      {
        ...state,
        [e.target.name]: e.target.value,
      },
      console.log(state.searchValue)
    );
    filter();
  };
  const filter = () => {
    var arr = [];
    if (state.option === "All") {
      console.log("all");
      state.products.forEach((prod) => {
        if (
          prod.name.toLowerCase().includes(state.searchValue.toLowerCase()) ||
          prod.category
            .toLowerCase()
            .includes(state.searchValue.toLowerCase()) ||
          prod.subcategory?.name
            .toLowerCase()
            .includes(state.searchValue.toLowerCase()) ||
          prod.subcategory?.type
            ?.toLowerCase()
            .includes(state.searchValue.toLowerCase())
        ) {
          arr.push(prod);
        }
      });
    }
    if (state.option === "Categories") {
      console.log("cat");

      state.products.forEach((prod) => {
        if (
          prod.category.toLowerCase().includes(state.searchValue.toLowerCase())
        ) {
          arr.push(prod);
        }
      });
    }
    if (state.option === "Subcategories") {
      state.products.forEach((prod) => {
        if (
          prod.subcategory?.name
            .toLowerCase()
            .includes(state.searchValue.toLowerCase())
        ) {
          arr.push(prod);
        }
      });
    }
    if (state.option === "Type") {
      state.products.forEach((prod) => {
        if (prod.subcategory?.type?.includes(state.searchValue)) {
          arr.push(prod);
        }
      });
    }
    setstate({ showProducts: arr });
  };
  // console.log(state.products);
  return (
    <>
      <div className="Products">
        <div className="top">
          <button
            className="addNew"
            type="button"
            onClick={() => setstate({ ...state, modal: true })}
          >
            <i className="fa-solid fa-plus"></i>Add New
          </button>
          <div className="searchDiv">
            <FormControl variant="filled">
              <InputLabel id="demo-simple-select-standard-label">
                Search In...
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.option}
                name="option"
                onChange={handleChange}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Categories">Categories</MenuItem>
                <MenuItem value="Subcategories">Subcategories</MenuItem>
                <MenuItem value="Type">Type</MenuItem>
                <MenuItem value="date">date</MenuItem>
              </Select>
            </FormControl>

            <TextField
              variant="filled"
              className="input"
              label="Search Value"
              value={state.searchValue}
              name="searchValue"
              onChange={handleChange}
              size="small"
            />
          </div>
        </div>
        <div className="table">
          <div className="header">
            <p>Name</p>
            <p>Category</p>
            <p>Sub Category</p>
            <p>Type</p>
            <p>Price</p>
            <p>Date</p>
            <p>Actions</p>
          </div>
          {state.showProducts
            .filter((item) => item.status)
            .map((item, id) => {
              return (
                <div className="product">
                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p> {item.subcategory.name}</p>
                  <p>{item.subcategory.type || "-"}</p>
                  <p>${item.price}</p>
                  <p>{moment(item.date.toDate()).fromNow()}</p>
                  <div className="actions">
                    <EditOutlinedIcon
                      onClick={() => {
                        setstate({
                          ...state,
                          modal: true,
                          edit: true,
                          editProduct: item,
                        });
                      }}
                    />
                    <DeleteOutlineOutlinedIcon
                      onClick={() => {
                        setstate({
                          ...state,
                          delete: true,
                          deleteProduct: item,
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {state.modal && (
        <AddModal
          setModal={() => {
            setstate({ ...state, modal: false, edit: false });
          }}
          edit={state.edit}
          editProduct={state.editProduct}
        />
      )}
      {state.delete && (
        <DeleteModal
          setModal={(arg) => setstate({ ...state, delete: arg })}
          deleteFunction={() => {
            updateDoc(doc(db, "products", state.deleteProduct.id), {
              status: 0,
            });
          }}
          name={state.deleteProduct.name}
        />
      )}
    </>
  );
}

export default Products;
