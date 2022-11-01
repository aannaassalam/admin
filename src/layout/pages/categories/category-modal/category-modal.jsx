import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import {
  doc,
  getFirestore,
  namedQuery,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { createRef } from "react";
import "./category-modal.css";

export default function CategoryModal({ setModal, category }) {
  const [name, setName] = useState(category?.name || "");
  const [typePermission, setTypePermission] = useState(
    category?.types.length || false
  );
  const [types, setTypes] = useState(
    category?.types.length ? category?.types : [""]
  );
  const [categories, setCategories] = useState([]);
  const [errMsg, setErrMsg] = useState({ input: "", msg: "" });

  const db = getFirestore();
  const docRef = doc(db, "settings", "dMsgyXwanQY5tnH075J0");

  useEffect(() => {
    onSnapshot(
      docRef,
      (doc) => {
        setCategories(doc.data().categories);
      },
      (err) => console.log(err)
    );
  }, []);

  useEffect(() => {
    if (errMsg.input) {
      setTimeout(() => {
        setErrMsg({ input: "", msg: "" });
      }, 5000);
    }
  }, [errMsg]);

  const addCategory = () => {
    if (name.trim() !== "") {
      updateDoc(docRef, {
        categories: [
          ...categories,
          {
            name: name,
            types: typePermission
              ? types.filter((type) => type.trim() !== "")
              : [],
            id:
              categories.length > 0
                ? categories[categories.length - 1].id + 1
                : 1,
            subcategories: [],
          },
        ],
      })
        .then(() => {
          console.log("Added");
          setModal(false);
        })
        .catch((err) => console.log(err));
    } else {
      setErrMsg({ input: "name", msg: "Please fill in Category Name" });
    }
  };

  const editCategory = () => {
    if (name.trim() !== "") {
      updateDoc(docRef, {
        categories: categories.map((cate) => {
          if (cate.id === category.id) {
            cate.name = name;
            cate.types = types;
          }
          return cate;
        }),
      })
        .then(() => {
          console.log("Updated");
          setModal(false);
        })
        .catch((err) => console.log(err));
    } else {
      setErrMsg({ input: "name", msg: "Please fill in Category Name" });
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h5>Add Category</h5>
          <span onClick={() => setModal(false)}>
            <i className="fa-solid fa-times"></i>
          </span>
        </div>
        <div className="modal-body">
          <TextField
            variant="filled"
            label="Enter Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            fullWidth
            error={errMsg.input === "name"}
            helperText={errMsg.input === "name" && errMsg.msg}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={typePermission}
                onChange={() => setTypePermission(!typePermission)}
              />
            }
            label="Types"
          />
          {typePermission && (
            <div className="types">
              {types.map((type, idx) => (
                <div key={idx}>
                  <TextField
                    variant="filled"
                    value={type}
                    label="Enter type"
                    onChange={(e) =>
                      setTypes((prev) =>
                        prev.map((p, id) => {
                          if (id === idx) p = e.target.value;
                          return p;
                        })
                      )
                    }
                    size="small"
                  />
                  {types.length !== 1 && (
                    <span
                      onClick={() =>
                        setTypes((prev) => prev.filter((p, id) => id !== idx))
                      }
                    >
                      <i className="fa-solid fa-times"></i>
                    </span>
                  )}
                </div>
              ))}
              <p onClick={() => setTypes((prev) => [...prev, ""])}>
                [+ Add another type]
              </p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="cancel"
            onClick={() => setModal(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="save"
            onClick={category ? editCategory : addCategory}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
