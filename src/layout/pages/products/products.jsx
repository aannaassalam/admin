import React, { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import DeleteModal from "../../components/delete-modal/delete-modal";
import "./products.css";
import moment from "moment";
import AddModal from "./addModal/addModal";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
function Products() {
  const [state, setstate] = useState({
    modal: false,
    products: [],
    edit: false,
    delete: false,
    editProduct: {},
    deleteProduct: {},
  });
  const db = getFirestore();
  const collec = collection(db, "products");
  useEffect(() => {
    onSnapshot(collec, (snap) => {
      var arr = [];
      var prod = {};
      snap.docs.forEach((doc) => {
        prod = doc.data();
        prod.id = doc.id;
        arr.push(prod);
      });
      setstate({ ...state, products: arr });
    });
  }, []);
  console.log(state.products);
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
        </div>
        <div className="table">
          <div className="header">
            <p> Name</p>
            <p> Category</p>
            <p> Sub Category</p>
            <p> Type</p>
            <p> Price</p>
            <p>Date</p>
            <p>Actions</p>
          </div>
          {state.products.map((item, id) => (
            <div className="product">
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p> {item.subCategory}</p>
              <p>{item.type}</p>
              <p> {item.price}</p>
              <p>{moment(item.date.toDate()).format("MMM Do YY")}</p>
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
          ))}
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
            deleteDoc(doc(db, "products", state.deleteProduct.id));
          }}
          name={state.deleteProduct.name}
        />
      )}
    </>
  );
}

export default Products;
