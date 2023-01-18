import { FormControlLabel, Radio, TextField } from "@mui/material";
import { doc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import "./subcategory-modal.css";

export default function SubcategoryModal({
  setModal,
  subcategory,
  categoryID,
}) {
  const [name, setName] = useState(subcategory?.name || "");
  const [type, setType] = useState(subcategory?.type || "");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [errMsg, setErrMsg] = useState({ input: "", msg: "" });

  const db = getFirestore();
  const docRef = doc(db, "settings", "dMsgyXwanQY5tnH075J0");

  useEffect(() => {
    onSnapshot(
      docRef,
      (doc) => {
        const local_category = doc
          .data()
          .categories.filter((category) => category.id === categoryID)[0];
        setCategories(doc.data().categories);
        setCategory(local_category);
        setSubcategories(local_category.subcategories);
        !subcategory && setType(local_category.types?.[0]);
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

  const addSubcategory = () => {
    const id =
      subcategories.length > 0
        ? `sub${
            parseInt(subcategories[subcategories.length - 1].id.substring(3)) +
            1
          }`
        : "sub1";
    var found = false;
    subcategories.forEach((sub) => {
      if (category.types.length > 0) {
        if (
          sub.name.toLowerCase() === name.trim().toLowerCase() &&
          sub.type === type
        )
          found = true;
      } else {
        if (sub.name.toLowerCase() === name.trim().toLowerCase()) found = true;
      }
    });
    if (name.trim() !== "" && !found) {
      updateDoc(docRef, {
        categories: categories.map((cate) => {
          if (cate.id === categoryID) {
            cate.subcategories = [
              ...subcategories,
              {
                name,
                type: type || "",
                id: id,
              },
            ];
          }
          return cate;
        }),
      })
        .then(() => {
          console.log("Added");
          setModal(false);
        })
        .catch((err) => console.log(err));
    } else if (name.trim().length === 0) {
      setErrMsg({ input: "name", msg: "Please fill in Subcategory Name" });
    } else {
      setErrMsg({ input: "name", msg: "Subcategory already exists!" });
    }
  };

  const editSubcategory = () => {
    var found = false;
    subcategories.forEach((sub) => {
      if (category.types.length === 0) {
        if (
          sub.name.toLowerCase() === name.trim().toLowerCase() &&
          sub.name !== subcategory.name
        )
          found = true;
      } else {
        if (
          sub.name.toLowerCase() === name.trim().toLowerCase() &&
          sub.type === type
        ) {
          if (
            subcategory.name.toLowerCase() === name.trim().toLowerCase() &&
            subcategory.type === type
          )
            found = false;
          else found = true;
        }
      }
    });
    if (name.trim() !== "" && !found) {
      updateDoc(docRef, {
        categories: categories.map((cate) => {
          if (cate.id === categoryID) {
            cate.subcategories = subcategories.map((sub) => {
              if (sub.id === subcategory.id) {
                sub.name = name;
                sub.type = type;
              }
              return sub;
            });
          }
          return cate;
        }),
      })
        .then(() => {
          console.log("Updated");
          setModal(false);
        })
        .catch((err) => console.log(err));
    } else if (name.trim().length === 0) {
      setErrMsg({ input: "name", msg: "Please fill in Subcategory Name" });
    } else if (category.types.length > 0) {
      setErrMsg({
        input: "name",
        msg: "Subcategory already exists for this type!",
      });
    } else {
      setErrMsg({ input: "name", msg: "Subcategory already exists!" });
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h5>Add Subcategory</h5>
          <span onClick={() => setModal(false)}>
            <i className="fa-solid fa-times"></i>
          </span>
        </div>
        <div className="modal-body">
          <TextField
            variant="filled"
            label="Enter Subcategory Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            fullWidth
            error={errMsg.input === "name"}
            helperText={errMsg.input === "name" && errMsg.msg}
          />
          {category.types?.length > 0 && (
            <>
              <span className="choose-type">Choose a Type</span>
              <div className="types-sec">
                {category.types.map(
                  (typ, idx) =>
                    typ && (
                      <FormControlLabel
                        key={idx}
                        value={typ}
                        control={<Radio size="small" checked={typ === type} />}
                        onChange={(e) => setType(e.target.value)}
                        label={typ}
                        sx={{
                          "& .MuiFormControlLabel-label": { fontSize: 14 },
                        }}
                      />
                    )
                )}
              </div>
            </>
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
            onClick={subcategory ? editSubcategory : addSubcategory}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
