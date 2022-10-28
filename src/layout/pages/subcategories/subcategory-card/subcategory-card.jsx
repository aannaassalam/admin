import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import DeleteModal from "../../../components/delete-modal/delete-modal";
import SubcategoryModal from "../subcategory-modal/subcategory-modal";
// import CategoryModal from "../../pages/categories/category-modal/category-modal";
import "./subcategory-card.css";

export default function SubcategoryCard({ subcategory, categoryID }) {
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

  const deleteSubcategory = () => {
    getDoc(docRef)
      .then((doc) => {
        const categories = doc.data().categories;
        setDoc(
          docRef,
          {
            categories: categories.map((category) => {
              if (category.id === categoryID) {
                category.subcategories = category.subcategories.filter(
                  (sub) => sub.id !== subcategory.id
                );
              }
              return category;
            }),
          },
          { merge: true }
        )
          .then(() => console.log("deleted"))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  // useEffect(() => {
  //   window.addEventListener("click", clickAway, true);

  //   return () => {
  //     window.addEventListener("click", clickAway, true);
  //   };
  // }, []);

  return (
    <div
      className="subcategory-card"
      style={{
        backgroundColor: colors[randomNumber].hex,
        backgroundImage: colors[randomNumber].gradient,
      }}
    >
      <h3>
        {subcategory.name}
        <span
          onClick={() => {
            setDropdown(!dropdown);
          }}
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </span>
      </h3>
      {dropdown && (
        <div className="dropdown-menu">
          <div
            className="dropdown-item"
            onClick={() => {
              setEditModal(true);
              setDropdown(false);
            }}
          >
            Edit Subcategory
          </div>
          <div
            className="dropdown-item"
            onClick={() => {
              setDeleteModal(true);
              setDropdown(false);
            }}
          >
            Delete Subcategory
          </div>
        </div>
      )}
      {subcategory.type && (
        <p>
          Type: <span className="type-box">{subcategory.type}</span>
        </p>
      )}

      {editModal && (
        <SubcategoryModal
          subcategory={subcategory}
          setModal={setEditModal}
          categoryID={categoryID}
        />
      )}
      {deleteModal && (
        <DeleteModal
          setModal={setDeleteModal}
          deleteFunction={deleteSubcategory}
          name="Subcategory"
        />
      )}
    </div>
  );
}
