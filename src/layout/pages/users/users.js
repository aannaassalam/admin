import React, { useRef, useEffect, useState } from "react";
import "./users.css";
import user from "../../../assets/user.png";
import userBig from "../../../assets/user (1).png";
import { Button, Modal } from "@material-ui/core";
import firebase from "firebase";
import Loader from "../../components/loader/loader";
import Table from "../../components/table/table";
import moment from "moment";

function Users() {
  const [addresses, setAddresses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const table = useRef();

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((snap) => {
        var users = [];
        snap.forEach((doc) => {
          var user = doc.data();
          user.id = doc.id;
          users.push(user);
        });
        setUsers(users);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      Header: "User",
      Cell: (props) => {
        return (
          <div style={{ display: "flex" }}>
            <img
              src={props.row.original.profilePic || user}
              alt=""
              style={{
                width: 40,
                height: 40,
                objectFit: "contain",
                marginRight: 15,
              }}
            />
            <div className="table-box">
              <p className="upper" style={{ fontWeight: 500 }}>
                {props.row.original.name}
              </p>
            </div>
          </div>
        );
      },
      filter: "fuzzyText",
      sortable: true,
    },
    {
      Header: "Email",
      Cell: (props) => (
        <div className="table-box">
          <p
            className="upper"
            style={{ fontWeight: 500, textTransform: "none" }}
          >
            {props.row.original.email}
          </p>
        </div>
      ),
      filter: "fuzzyText",
    },
    {
      Header: "Phone",
      Cell: (props) => (
        <div className="table-box">
          <p
            className="upper"
            style={{ fontWeight: 500, textTransform: "none" }}
          >
            {props.row.original.phone || "-"}
          </p>
        </div>
      ),
      filter: "fuzzyText",
    },
    {
      Header: "Whatsapp No.",
      Cell: (props) => (
        <div className="table-box">
          <p
            className="upper"
            style={{ fontWeight: 500, textTransform: "none" }}
          >
            {props.row.original.alt || "-"}
          </p>
        </div>
      ),
      filter: "fuzzyText",
    },
    {
      Header: "Date of birth",
      Cell: (props) => (
        <div className="table-box">
          <p
            className="upper"
            style={{ fontWeight: 500, textTransform: "none" }}
          >
            {props.row.original.dob !== null
              ? moment(props.row.original.dob).format("D/MM/YYYY")
              : "-"}
          </p>
        </div>
      ),
      filter: "fuzzyText",
    },
    {
      Header: "Actions",
      Cell: (props) => (
        <div className="actions">
          {props.row.original.addresses?.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => setAddresses(props.row.original.addresses || [])}
            >
              Addresses
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="users">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="title">
            <div className="left">
              <img src={userBig} alt="" />
              <h4>Users</h4>
            </div>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => table.current.export()}
            >
              Download
            </Button> */}
          </div>
          <div className="table">
            {users.length > 0 ? (
              <Table columns={columns} data={users} ref={table} />
            ) : (
              <h2 style={{ textAlign: "center" }}>No Users available</h2>
            )}
          </div>
        </>
      )}
      <Modal open={addresses.length > 0} onClose={() => setAddresses([])}>
        <div className="modal category">
          <div className="head">
            <h4>Addresses</h4>
            <i className="fas fa-times" onClick={() => setAddresses([])}></i>
          </div>
          <div className="body">
            {addresses.map((address) => (
              <p
                style={{
                  padding: "15px 0",
                  borderBottom: "1px solid #70707050",
                }}
              >
                {address.name} - {address.number} <br />
                {address.address}, {address.city} {address.pincode},{" "}
                {address.state}
              </p>
            ))}
          </div>
          <div className="footer">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setAddresses([])}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Users;
