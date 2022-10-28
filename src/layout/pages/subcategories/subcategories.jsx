import React from "react";
import "./subcategories.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import SubcategoryCard from "./subcategory-card/subcategory-card";
import SubcategoryModal from "./subcategory-modal/subcategory-modal";

export default function Subcategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [categoryID, setCategoryID] = useState();
  const [modal, setModal] = useState(false);

  const params = useParams();

  useEffect(() => {
    onSnapshot(
      doc(getFirestore(), "settings", "dMsgyXwanQY5tnH075J0"),
      (doc) => {
        setSubcategories(
          doc
            .data()
            .categories.filter(
              (category) => category.name === params.category
            )[0].subcategories
        );
        setCategoryID(
          doc
            .data()
            .categories.filter(
              (category) => category.name === params.category
            )[0].id
        );
      }
    );
  }, []);

  return (
    <div className="subcategories">
      <div className="subcategories-container">
        {subcategories?.map((subcategory) => (
          <SubcategoryCard
            subcategory={subcategory}
            key={subcategory.id}
            categoryID={categoryID}
          />
        ))}
      </div>
      <div className="addnew">
        <button type="button" onClick={() => setModal(true)}>
          <i className="fa-solid fa-plus"></i>Add New
        </button>
      </div>
      {modal && (
        <SubcategoryModal setModal={setModal} categoryID={categoryID} />
      )}
    </div>
  );
}
