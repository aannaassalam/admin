import React, { useRef } from "react";
import "./invoice.css";
import logo from "../../../assets/logo.png";
import moment from "moment";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
function Invoice({ order, setState }) {
  const invoice = useRef();

  console.log(order);
  // const htmlToImageConvert = () => {
  //   toPng(invoice.current, { cacheBust: false })
  //     .then((dataUrl) => {
  //       const link = document.createElement("a");
  //       link.download = "my-image-name.png";
  //       link.href = dataUrl;
  //       link.click();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  const handleCaptureClick = async () => {
    const canvas = await html2canvas(invoice.current);
    const dataURL = canvas.toDataURL("image/png");
    downloadjs(dataURL, "download.png", "image/png");
  };
  return (
    <div className="Invoice">
      <i class="fa-solid fa-xmark crossMark" onClick={() => setState()}></i>
      <div className="invoiceMain" ref={invoice}>
        <div className="topInvoice">
          <img src={logo} alt="" />
          {/* <h2>INVOICE</h2> */}
          <div className="companyDetails">
            <h3>Nutuyu72</h3>
            <p>Salsaal Shahid</p>
            <p>87/A london road, London Uk XXXXXX</p>
            <p>+91 1234567890</p>
          </div>
        </div>
        <div className="orderInfo">
          <div className="companyDetails">
            <h3 style={{ color: "rgb(116,116,116)", marginBottom: 10 }}>
              Bill To
            </h3>
            <p>{order.billing_address.name}</p>
            <p>{order.billing_address.address1}</p>
            <p>
              {order.billing_address.city +
                " ," +
                order.billing_address.state +
                ", " +
                order.billing_address.zipcode}
            </p>

            <p>{order.billing_address.phone}</p>
          </div>
          <div className="orderDetails">
            <p>
              OrderId : <span>{order.id}</span>
            </p>
            <p>
              Order Date :
              <span> {moment(order.date.toDate()).format("MMM Do YYYY")}</span>
            </p>
            <p>
              Payment Mode : <span>COD</span>
            </p>
          </div>
        </div>
        <div className="itemDescription">
          <div className="header">
            <p>Item Description</p>
            <p>Quantity</p>
            <p>Rate</p>
            <p>Amount</p>
          </div>
          {order.items.map((item, id) => (
            <div className="item">
              <p>{item.name}</p>
              <p>{item.quantity}</p>
              <p>{item.variance.sellingPrice}</p>
              <p>{item.variance.sellingPrice * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="total">
          <div>
            <p>Sub Total</p>
            <p>{order.total}</p>
          </div>
          <div>
            <p>Shipping</p>
            <p>{order.total}</p>
          </div>
          <div>
            <p> Total</p>
            <p> $ {order.total}</p>
          </div>
        </div>
      </div>
      <button
        title="Download Invoice"
        onClick={() => {
          const doc = new jsPDF({
            format: [400.28, 841.89],
            unit: "px",
            compress: true,
          });
          doc.html(invoice.current, {
            async callback(doc) {
              doc.save(`${order.billing_address.name}'s Invoice`);
            },
          });
          // handleCaptureClick();
        }}
        className="invoiceButton download"
      >
        <i class="fa-solid fa-cloud-arrow-down"></i>
      </button>
    </div>
  );
}

export default Invoice;
