import React, { Component } from "react";
import "./loader.css";

export default class Loader extends Component {
  componentDidMount() {
    document.body.style.overflow = "hidden";
  }

  componentWillUnmount() {
    document.body.style.overflow = "auto";
  }

  render() {
    return (
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }
}
