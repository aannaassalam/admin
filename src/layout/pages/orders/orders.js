import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import moment from "moment";
import React, { useState, useEffect } from "react";
import "./orders.css";
import "../products/products.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@mui/material";
function Orders() {
  const [state, setstate] = useState({
    orders: [],
  });
  const db = getFirestore();
  const collectionRef = collection(db, "orders");
  useEffect(() => {
    onSnapshot(collectionRef, (snap) => {
      var arr = [];
      var order = {};
      snap.docs.forEach((doc) => {
        order = doc.data();
        order.id = doc.id;
        arr.push(order);
      });
      setstate({ ...state, orders: arr });
    });
  }, []);
  return (
    <div className="orders">
      <div className="table">
        {state?.orders
          ?.sort((a, b) => b.date - a.date)
          .map((item, id) => {
            return (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <div className="order">
                    <p style={{ justifySelf: "flex-start" }} className="col-p">
                      <span>Name</span>
                      {item?.shipping_address.name}
                    </p>
                    <p className="col-p">
                      <span>Phone</span>
                      {item?.user.user_phone}
                    </p>
                    <p className="col-p">
                      <span>Order ID</span>
                      {item?.id}
                    </p>
                    <p className="col-p">
                      <span>Order Total</span>${item?.total}
                    </p>
                    <p className="col-p">
                      <span>Date</span>
                      {moment(item?.date.toDate()).fromNow()}
                    </p>
                    <p className="col-p" style={{ alignItems: "center" }}>
                      <span>Actions</span>
                      <div className="buttons">
                        <button>Accept</button>
                        <button>Decline</button>
                      </div>
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="top">
                    <div>
                      <h4>Shipping Address</h4>
                      <div>
                        <p>
                          <div className="col-p">
                            Address 1: {item.shipping_address.address1} ,{" "}
                          </div>
                          <p className="col-p">
                            <span>City</span>
                            {item.shipping_address.city}{" "}
                          </p>
                          <p className="col-p">
                            <span>State</span>
                            {item.shipping_address.state}{" "}
                          </p>
                          <p className="col-p">
                            <span>Zipcode</span>
                            {item.shipping_address.zipcode}
                          </p>
                        </p>
                        <p> Address 2: {item.shipping_address.address2}</p>
                      </div>
                    </div>
                    <div>
                      <h4>Billing Address</h4>
                      <div>
                        <p>
                          Address 1 :{item.billing_address.address1}{" "}
                          <p className="col-p">
                            <span>City</span>
                            {item.billing_address.city}{" "}
                          </p>
                          <p className="col-p">
                            <span>State</span>
                            {item.billing_address.state}{" "}
                          </p>
                          <p className="col-p">
                            <span>Zipcode</span>
                            {item.billing_address.zipcode}
                          </p>
                        </p>
                        <p> Address 2 : {item.billing_address.address2}</p>
                      </div>
                    </div>
                  </div>
                  <h4>Order Items</h4>
                  {item.items.map((prod) => (
                    <div className="orderItem">
                      <p className="col-p">
                        <span>Product Name</span>
                        <a
                          href={`https://nutuyu72.web.app/product/${prod.id}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: "underline" }}
                        >
                          {prod.name}
                        </a>
                      </p>
                      <p className="col-p">
                        <span>Product Category</span>
                        {prod.category}
                      </p>
                      <p className="col-p">
                        <span>Product SubCategory</span>
                        {prod.subcategory.name}
                      </p>{" "}
                      <p className="col-p">
                        <span>Product Type</span>
                        {prod.subcategory.type && prod.subcategory.type}
                      </p>
                      <p className="col-p">
                        <span>Product Price</span>${prod.price}
                      </p>
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            );
          })}
      </div>
    </div>
  );
}

export default Orders;
