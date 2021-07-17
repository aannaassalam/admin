import React from "react";
import "./category-card.css";
import { Button } from "@material-ui/core";

function CategoryCard({
  img,
  name,
  handleDelete,
  handleEdit,
  setSubCategories,
}) {
  return (
    <div className="categoryCard" onClick={setSubCategories}>
      <img src={img} alt="" />
      <h4>{name}</h4>
      <div className="action-btns">
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          <i className="fas fa-pen"></i>
        </Button>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <i className="fas fa-trash"></i>
        </Button>
      </div>
    </div>
  );
}

export default CategoryCard;
