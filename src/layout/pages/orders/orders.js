import React, { useEffect, useState } from "react";
import "./orders.css";
import cargo from "../../../assets/cargo.png";
import {
  Backdrop,
  Button,
  CircularProgress,
  Modal,
  TextField,
} from "@material-ui/core";
import firebase from "firebase";
import moment from "moment";
import Table from "../../components/table/table";
import Card from "../../components/card/card";
import ListCard from "../../components/listCard/listCard";
import Loader from "../../components/loader/loader";
import toaster from "toasted-notes";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [info, setInfo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [awb, setAwb] = useState("");
  const [awbModal, setAwbModal] = useState(false);
  const [editID, setEditID] = useState("");
  const [tab, setTab] = useState("all");
  const [sortedOrders, setSortedOrders] = useState({});

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    firebase
      .firestore()
      .collection("orders")
      .get()
      .then(async (snap) => {
        var orders = [];
        snap.forEach((doc) => {
          var order = doc.data();
          order.id = doc.id;
          orders.push(order);
        });

        var orders2 = [];

        for (const order of orders) {
          console.log(order);
          if (order.awb_number.length > 0) {
            const config = {
              headers: {
                Authorization:
                  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjE2MTA0NTMsImlzcyI6Imh0dHBzOi8vYXBpdjIuc2hpcHJvY2tldC5pbi92MS9leHRlcm5hbC9hdXRoL2xvZ2luIiwiaWF0IjoxNjI1NTkzMDYzLCJleHAiOjE2MjY0NTcwNjMsIm5iZiI6MTYyNTU5MzA2MywianRpIjoiY3hDUktISzBicnVlNndTYSJ9.hJA9mVTqq6tVNoNiBgrjg8ZSQdsT7MHRWN38Y8ARegY",
              },
            };
            await axios
              .get(
                `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${order.awb_number}`,
                config
              )
              .then((res) => {
                console.log(res.data);
                if (
                  !order.status.includes(res.data.tracking_data.shipment_status)
                ) {
                  order.status.push(res.data.tracking_data.shipment_status);
                  firebase
                    .firestore()
                    .collection("orders")
                    .doc(order.id)
                    .update({
                      status: order.status,
                    })
                    .then(() => {
                      orders2.push(order);
                    })
                    .catch((err) => console.log(err));
                } else {
                  console.log("here");
                  orders2.push(order);
                }
              })
              .catch((err) => console.log(err));
          } else {
            orders2.push(order);
          }
        }

        var process_orders = [];
        var transit_orders = [];
        var delivered_orders = [];
        var cancel_orders = [];
        console.log(snap.size);
        console.log(orders.length);
        if (snap.size === orders2.length) {
          orders2.forEach((item, index) => {
            console.log(item.status);
            if (
              item.status.includes(0) &&
              !item.status.includes(18) &&
              !item.status.includes(7) &&
              !item.status.includes(8)
            ) {
              process_orders.push(item);
            } else if (
              item.status.includes(18) &&
              !item.status.includes(7) &&
              !item.status.includes(8)
            ) {
              transit_orders.push(item);
            } else if (item.status.includes(7) && !item.status.includes(8)) {
              delivered_orders.push(item);
            } else {
              cancel_orders.push(item);
            }

            if (index === orders.length - 1) {
              var obj = {
                all: orders2,
                process: process_orders,
                transit: transit_orders,
                delivered: delivered_orders,
                cancel: cancel_orders,
              };
              setOrders(orders2);
              setSortedOrders(obj);
              setLoading(false);
            }
          });
        }
      });
  };

  console.log(sortedOrders);

  const columns = [
    {
      Header: "Product Details",
      Cell: (props) => {
        return (
          <div style={{ display: "flex" }}>
            <img
              src={
                // props.row.original.products &&
                props.row.original.products[0]?.images[0].image
              }
              alt=""
            />
            <div className="table-box">
              <p className="upper">
                {props.row.original.products[0]?.title}
                {props.row.original.products.length > 1
                  ? ` & ${props.row.original.products.length} more`
                  : null}
              </p>
            </div>
          </div>
        );
      },
      filter: "fuzzyText",
      sortable: true,
    },
    {
      Header: "User",
      Cell: (props) => (
        <div className="table-box">
          <p className="upper">
            {props.row.original.firstName + " " + props.row.original.lastName}
          </p>
          <p className="upper">{props.row.original.number}</p>
        </div>
      ),
      filter: "fuzzyText",
    },
    {
      Header: "Total",
      Cell: (props) => (
        <div className="table-box">
          <p className="upper">&#8377; {props.row.original.total}</p>
        </div>
      ),
      filter: "fuzzyText",
    },
    {
      Header: "Payment",
      Cell: (props) => (
        <div className="table-box">
          <p className="upper">{props.row.original.payment}</p>
        </div>
      ),
      filter: "fuzzyText",
    },
    {
      Header: "Status",
      Cell: (props) => (
        <div className="table-box">
          <p className="upper">
            {props.row.original.status.includes(0) &&
            !props.row.original.status.includes(18) &&
            !props.row.original.status.includes(7) &&
            !props.row.original.status.includes(8)
              ? "Process"
              : props.row.original.status.includes(18) &&
                !props.row.original.status.includes(7) &&
                !props.row.original.status.includes(8)
              ? "Transit"
              : props.row.original.status.includes(7) &&
                !props.row.original.status.includes(8)
              ? "Delivered"
              : "canceled"}
          </p>
        </div>
      ),
      filter: "fuzzyText",
    },
    {
      Header: "Date",
      Cell: (props) => (
        <div className="table-box">
          <p className="upper">
            {moment(props.row.original.date.toDate()).format("Do MMM YYYY")}
          </p>
        </div>
      ),
      filter: "fuzzyText",
    },

    {
      Header: "Actions",
      Cell: (props) => {
        return (
          <div className="actions">
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: 5 }}
              size="small"
              onClick={() => {
                setSelectedOrder(props.row.original);
                setInfo(true);
              }}
            >
              Info
            </Button>
            {props.row.original.status !== -1 && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => {
                  setEditID(props.row.original.id);
                  setAwb(props.row.original.awb_number);
                  setAwbModal(true);
                }}
              >
                AWB
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleAwb = () => {
    setUploading(true);
    if (awb.length > 0) {
      firebase
        .firestore()
        .collection("orders")
        .doc(editID)
        .update({
          awb_number: awb,
        })
        .then(() => {
          toaster.notify("AWB Updated!!");
          init();
          setUploading(false);
          setAwbModal(false);
          setAwb("");
        });
    } else {
      toaster.notify("AWB number can't be empty");
      setUploading(false);
    }
  };

  return (
    <div className="orders">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="title">
            <div className="left">
              <img src={cargo} alt="" />
              <h4>Orders</h4>
            </div>
          </div>
          <div className="order-btns">
            <Button
              variant={tab === "all" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setTab("all")}
            >
              All Orders
            </Button>
            <Button
              variant={tab === "process" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setTab("process")}
            >
              Process Orders
            </Button>
            <Button
              variant={tab === "transit" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setTab("transit")}
            >
              Transit Orders
            </Button>
            <Button
              variant={tab === "delivered" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setTab("delivered")}
            >
              Delivered Orders
            </Button>
            <Button
              variant={tab === "cancel" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setTab("cancel")}
            >
              Canceled Orders
            </Button>
          </div>
          <div className="table order">
            {sortedOrders[tab].length > 0 ? (
              <Table columns={columns} data={sortedOrders[tab]} />
            ) : (
              <h3 className="warning">No Orders available.</h3>
            )}
          </div>
          <Modal open={info} onClose={() => setInfo(false)}>
            <div className="modal category orders">
              <div className="head">
                <h4>Order Info</h4>
                <i className="fas fa-times" onClick={() => setInfo(false)}></i>
              </div>
              <div className="body">
                {selectedOrder.products &&
                  selectedOrder.products.map((product) => (
                    <ListCard
                      productID={product.id}
                      cartQuantity={product.cartQuantity}
                      key={product.id}
                      noCross
                    />
                  ))}
                <div className="row">
                  <p>Order ID: </p>
                  <p>{selectedOrder.id}</p>
                </div>
                <div className="row">
                  <p>Order Status: </p>
                  <p>
                    {selectedOrder.status?.includes(0) &&
                    !selectedOrder.status?.includes(18) &&
                    !selectedOrder.status?.includes(7) &&
                    !selectedOrder.status?.includes(8)
                      ? "Process"
                      : selectedOrder.status?.includes(18) &&
                        !selectedOrder.status?.includes(7) &&
                        !selectedOrder.status?.includes(8)
                      ? "Transit"
                      : selectedOrder.status?.includes(7) &&
                        !selectedOrder.status?.includes(8)
                      ? "Delivered"
                      : "canceled"}
                  </p>
                </div>
                <div className="row">
                  <p>Name: </p>
                  <p>
                    {selectedOrder.firstName} {selectedOrder.lastName}
                  </p>
                </div>
                <div className="row">
                  <p>Phone number: </p>
                  <p>+91 {selectedOrder.number}</p>
                </div>
                <div className="row">
                  <p>address: </p>
                  <p>
                    {selectedOrder.address}, {selectedOrder.city} -{" "}
                    {selectedOrder.pincode}, {selectedOrder.state}
                  </p>
                </div>
                <div className="row">
                  <p>Location: </p>
                  <p>{selectedOrder.location}</p>
                </div>
                <div className="row">
                  <p>Payment: </p>
                  <p>{selectedOrder.payment}</p>
                </div>
                <div className="row">
                  <p>Items: </p>
                  <p>
                    {selectedOrder.products && selectedOrder.products.length}{" "}
                    Items
                  </p>
                </div>
                <div className="row">
                  <p>Total: </p>
                  <p>&#8377; {selectedOrder.total}</p>
                </div>
                <div className="row">
                  <p>Date: </p>
                  <p>
                    {selectedOrder.date &&
                      moment(selectedOrder.date.toDate()).format("Do MMM YYYY")}
                  </p>
                </div>
                <div className="row">
                  <p>AWB number: </p>
                  <p>{selectedOrder.awb || "null"}</p>
                </div>
              </div>
              <div className="footer">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setInfo(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
          <Modal open={awbModal} onClose={() => setAwbModal(false)}>
            <div className="modal category orders">
              <div className="head">
                <h4>Add AWB</h4>
                <i
                  className="fas fa-times"
                  onClick={() => setAwbModal(false)}
                ></i>
              </div>
              <div className="body">
                <TextField
                  label="AWB number"
                  variant="outlined"
                  size="small"
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                />
              </div>
              <div className="footer">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setAwbModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleAwb}>
                  Add
                </Button>
              </div>
            </div>
          </Modal>
          <Backdrop className="backdrop" open={uploading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
    </div>
  );
}

export default Orders;
