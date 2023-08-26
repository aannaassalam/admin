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
    edit: false,
    delete: false,
    editProduct: {},
    deleteProduct: {},
    option: "All",
    searchValue: "",
    sortValue: "",
  });
  const [showProducts, setshowProducts] = useState([]);
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
      setstate({ ...state, products: arr });
      setshowProducts(arr);
    });
  }, []);
  const handleChange = (e) => {
    console.log(e.target.value);
    setstate({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    var arr = [];
    if (state.searchValue || state.option === "date") {
      if (state.option === "All") {
        arr = state.products.filter(
          (prod) =>
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
        );
        console.log(arr);
      }
      if (state.option === "Name") {
        arr = state.products.filter((prod) =>
          prod.name.toLowerCase().includes(state.searchValue.toLowerCase())
        );
        console.log(arr);
      }
      if (state.option === "Categories") {
        arr = state.products.filter((prod) =>
          prod.category.toLowerCase().includes(state.searchValue.toLowerCase())
        );
        console.log(arr);
      }
      if (state.option === "Subcategories") {
        arr = state.products.filter((prod) =>
          prod.subcategory?.name
            .toLowerCase()
            .includes(state.searchValue.toLowerCase())
        );
        console.log(arr);
      }
      if (state.option === "Type") {
        arr = state.products.filter((prod) =>
          prod.subcategory?.type
            ?.toLowerCase()
            .includes(state.searchValue.toLowerCase())
        );
        console.log(arr);
      }
      if (state.option === "date") {
        if (state.sortValue === "Lf") {
          arr = state.products.sort(
            (a, b) =>
              moment(a.date.toDate()).format("YYYYMMDD") -
              moment(b.date.toDate()).format("YYYYMMDD")
          );
        } else {
          arr = state.products.sort(
            (a, b) =>
              moment(b.date.toDate()).format("YYYYMMDD") -
              moment(a.date.toDate()).format("YYYYMMDD")
          );
        }
      }
    } else {
      arr = state.products;
    }
    setshowProducts(arr, console.log("ourting"));
  }, [state.searchValue, state.option, state.sortValue]);

  console.log(showProducts);
  return (
    <>
      {state.modal? <AddModal
          setModal={() => {
            setstate({ ...state, modal: false, edit: false });
          }}
          edit={state.edit}
          editProduct={state.editProduct}
      /> :
      <div className="Products">
      <div className="top">
        <h2 className="filterHeading">Search Filter :</h2>
        <div className="searchDiv">
          <FormControl variant="outlined" size="small">
            <InputLabel>Search In...</InputLabel>
            <Select
              value={state.option}
              name="option"
              label="Search In..."
              onChange={handleChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Name">Name</MenuItem>
              <MenuItem value="Categories">Categories</MenuItem>
              <MenuItem value="Subcategories">Subcategories</MenuItem>
              <MenuItem value="Type">Type</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>
          {state.option === "date" ? (
            <FormControl variant="outlined" size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={state.sortValue}
                name="sortValue"
                label="Sort By"
                onChange={handleChange}
              >
                <MenuItem value="Lf">Latest First</MenuItem>
                <MenuItem value="Ef">Earlier First</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              variant="outlined"
              className="input"
              label={`Enter ${state.option}`}
              value={state.searchValue}
              name="searchValue"
              onChange={handleChange}
              size="small"
            />
          )}
          <button
            className="addNew"
            type="button"
            onClick={() => setstate({ ...state, modal: true })}
          >
            <i className="fa-solid fa-plus"></i>Add New Product
          </button>
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
        {showProducts
          .filter((item) => item.status)
          .map((item, id) => {
            return (
              <div className="product">
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p> {item.subcategory.name}</p>
                <p>{item.subcategory.type || "-"}</p>
                <p>${item.sellingPrice}</p>
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
        }
      {/* {state.modal && (
        <AddModal
          setModal={() => {
            setstate({ ...state, modal: false, edit: false });
          }}
          edit={state.edit}
          editProduct={state.editProduct}
        />
      )} */}
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
