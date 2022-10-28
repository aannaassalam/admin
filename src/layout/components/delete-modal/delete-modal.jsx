import React from "react";
import "./delete-modal.css";

export default function DeleteModal({ setModal, deleteFunction, name }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h5>Detele {name}</h5>
          <span onClick={() => setModal(false)}>
            <i className="fa-solid fa-times"></i>
          </span>
        </div>
        <div className="modal-body">
          <span>Are You sure?</span>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="cancel"
            onClick={() => setModal(false)}
          >
            Not sure
          </button>
          <button type="button" className="delete" onClick={deleteFunction}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
