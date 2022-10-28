import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
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
    if (name.trim() !== "" && type) {
      setDoc(
        docRef,
        {
          categories: categories.map((cate) => {
            if (cate.id === categoryID) {
              cate.subcategories = [
                ...subcategories,
                {
                  name,
                  type,
                  id: `sub${
                    parseInt(
                      subcategories[subcategories.length - 1].id.substring(3)
                    ) + 1
                  }`,
                },
              ];
            }
            return cate;
          }),
        },
        { merge: true }
      )
        .then(() => {
          console.log("Added");
          setModal(false);
        })
        .catch((err) => console.log(err));
    } else {
      setErrMsg({ input: "name", msg: "Please fill in Category Name" });
    }
  };

  const editSubcategory = () => {
    if (name.trim() !== "" && type) {
      setDoc(
        docRef,
        {
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
        },
        { merge: true }
      )
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
          {category.types && (
            <>
              <span className="choose-type">Choose a Type</span>
              {/* <RadioGroup
                value={type}
                onChange={(e) => setType(e.target.value)}
              > */}
              <div className="types-sec">
                {category.types.map((typ, idx) => (
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
                ))}
              </div>
              {/* </RadioGroup> */}
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
