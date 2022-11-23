import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import CategoryModal from "../category-modal/category-modal";
import DeleteModal from "../../../components/delete-modal/delete-modal";
import "./category-card.css";
import clickAway from "../../../hooks/clickAway";

export default function CategoryCard({ category }) {
  const [dropdown, setDropdown] = useState(false);
  const [randomNumber] = useState(Math.floor(Math.random() * 4));
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const colors = [
    {
      hex: "#1f1498",
      gradient: "linear-gradient(45deg,#321fdb 0%,#1f1498 100%)",
    },
    { hex: "#2982cc", gradient: "linear-gradient(45deg,#39f 0%,#2982cc 100%)" },
    {
      hex: "#f6960b",
      gradient: "linear-gradient(45deg,#f9b115 0%,#f6960b 100%)",
    },
    {
      hex: "#d93737",
      gradient: "linear-gradient(45deg,#e55353 0%,#d93737 100%)",
    },
  ];

  const db = getFirestore();
  const docRef = doc(db, "settings", "dMsgyXwanQY5tnH075J0");

  const deleteCategory = () => {
    getDoc(docRef)
      .then((doc) => {
        const categories = doc.data().categories;
        updateDoc(docRef, {
          categories: categories.filter((cate) => cate.id !== category.id),
        })
          .then(() => console.log("deleted"))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    clickAway(() => setDropdown(false), true);

    return () => {
      clickAway(() => setDropdown(false), true);
    };
  }, []);

  return (
    <>
      <div
        className="category-card"
        style={{
          backgroundColor: colors[randomNumber].hex,
          backgroundImage: colors[randomNumber].gradient,
        }}
        onClick={() => (window.location.href = `/categories/${category.name}`)}
      >
        <h3>
          {category.name}
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDropdown(!dropdown);
            }}
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </span>
        </h3>
        {dropdown && (
          <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
            <div
              className="dropdown-item"
              onClick={() => {
                setEditModal(true);
                setDropdown(false);
              }}
            >
              Edit Category
            </div>
            <div
              className="dropdown-item"
              onClick={() => {
                setDeleteModal(true);
                setDropdown(false);
              }}
            >
              Delete Category
            </div>
          </div>
        )}
        {category.types.length > 0 && <p>Types</p>}
        <ul>
          {category.types.map((type, idx) => type && <li key={idx}>{type}</li>)}
        </ul>
      </div>

      {editModal && (
        <CategoryModal category={category} setModal={setEditModal} />
      )}
      {deleteModal && (
        <DeleteModal
          setModal={setDeleteModal}
          deleteFunction={deleteCategory}
          name="Category"
        />
      )}
    </>
  );
}
