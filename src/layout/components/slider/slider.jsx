import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./slider.css";
import Card from "../../components/card/card";
import { Button } from "@material-ui/core";

export default function Slider2({ heading, products, enableEdit }) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1380,
        settings: {
          slidesToShow: 4.5,
        },
      },
      {
        breakpoint: 1260,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3.3,
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 680,
        settings: {
          arrows: false,
          slidesToShow: 2.5,
        },
      },
      {
        breakpoint: 550,
        settings: {
          arrows: false,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 468,
        settings: {
          arrows: false,
          slidesToShow: 1.8,
        },
      },
      {
        breakpoint: 400,
        settings: {
          arrows: false,
          slidesToShow: 1.5,
        },
      },
      {
        breakpoint: 360,
        settings: {
          arrows: false,
          slidesToShow: 1.4,
        },
      },
    ],
  };
  return (
    <div className="dynamic-slider">
      <div className="heading">
        <h1>{heading}</h1>
        <Button variant="contained" color="primary" onClick={enableEdit}>
          Edit
        </Button>
      </div>
      <Slider {...settings}>
        {products.map((product, index) => (
          <Card product={product} key={index} />
        ))}
      </Slider>
    </div>
  );
}
