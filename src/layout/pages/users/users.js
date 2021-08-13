import React, { Component } from "react";
import "./users.css";
import user from "../../../assets/user.png";
import userBig from "../../../assets/user (1).png";
import { Button, Modal } from "@material-ui/core";
import firebase from "firebase";
import Loader from "../../components/loader/loader";
import Table from "../../components/table/table";
import moment from "moment";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      users: [],
      loading: true,
    };
  }

  componentDidMount() {
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
        this.setState({
          users,
          loading: false,
        });
      });
  }

  render() {
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
                onClick={() =>
                  this.setState({
                    addresses: props.row.original.addresses || [],
                  })
                }
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
        {this.state.loading ? (
          <Loader />
        ) : (
          <>
            <div className="title">
              <div className="left">
                <img src={userBig} alt="" />
                <h4>Users</h4>
              </div>
            </div>
            <div className="table">
              {this.state.users.length > 0 ? (
                <Table columns={columns} data={this.state.users} />
              ) : (
                <h2 style={{ textAlign: "center" }}>No Users available</h2>
              )}
            </div>
          </>
        )}
        <Modal
          open={this.state.addresses.length > 0}
          onClose={() =>
            this.setState({
              addresses: [],
            })
          }
        >
          <div className="modal category">
            <div className="head">
              <h4>Addresses</h4>
              <i
                className="fas fa-times"
                onClick={() =>
                  this.setState({
                    addresses: [],
                  })
                }
              ></i>
            </div>
            <div className="body">
              {this.state.addresses.map((address) => (
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
                onClick={() =>
                  this.setState({
                    addresses: [],
                  })
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Users;
