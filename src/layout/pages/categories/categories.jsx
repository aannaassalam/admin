import React, { useEffect, useState } from "react";
import "./categories.css";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import CategoryModal from "./category-modal/category-modal";
import CategoryCard from "./category-card/category-card";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);

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

  return (
    <div className="categories">
      <div className="categories-container">
        {categories?.map((category) => (
          <CategoryCard category={category} key={category.id} />
        ))}
      </div>
      <div className="addnew">
        <button type="button" onClick={() => setModal(true)}>
          <i className="fa-solid fa-plus"></i>Add New
        </button>
      </div>
      {modal && <CategoryModal setModal={setModal} />}
    </div>
  );
}
