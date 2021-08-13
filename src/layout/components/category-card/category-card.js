import React, { useState } from "react";
import "./category-card.css";
import { Button, Modal } from "@material-ui/core";

function CategoryCard({
  img,
  name,
  handleDelete,
  handleEdit,
  setSubCategories,
  product,
  click,
  uploading,
}) {
  const [deleteItem, setDeleteItem] = useState(false);

  return (
    <>
      <div
        className="categoryCard"
        onClick={product ? click : setSubCategories}
      >
        <img src={img} alt="" />
        <h4>{name}</h4>
        {!product && (
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
                setDeleteItem(true);
              }}
            >
              <i className="fas fa-trash"></i>
            </Button>
          </div>
        )}
      </div>
      <Modal open={deleteItem} onClose={() => setDeleteItem(false)}>
        <div className="modal category">
          <div className="head">
            <h4>Are You Sure?</h4>
            <i
              className="fas fa-times"
              onClick={() => setDeleteItem(false)}
            ></i>
          </div>
          <div className="body">
            <p>Are you sure, you want to delete this item?</p>
          </div>
          <div className="footer">
            <Button
              variant="text"
              color="primary"
              onClick={() => setDeleteItem(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setDeleteItem(false);
                handleDelete();
              }}
              disabled={uploading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CategoryCard;
