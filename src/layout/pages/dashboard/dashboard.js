import React, { useEffect, useState } from "react";
import "./dashboard.css";
import firebase from "firebase";
import Chart from "react-apexcharts";
import Loader from "../../components/loader/loader";
import { Button } from "@material-ui/core";

function Dashboard() {
  const [userSize, setUserSize] = useState(0);
  const [productSize, setProductSize] = useState(0);
  const [orderSize, setOrderSize] = useState(0);
  const [sales, setSales] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      id: "apexchart-example",
    },
    colors: ["#0B84A5"],
    noData: {
      text: "No Products available in this category",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "#008FFB",
        fontSize: "14px",
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: [],
      tooltip: {
        enabled: false,
      },
    },
  });
  const [series, setSeries] = useState([
    {
      name: "Sold",
      data: [],
    },
  ]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((snap) => {
        setUserSize(snap.size);
        firebase
          .firestore()
          .collection("settings")
          .get()
          .then((snap) => {
            var actCategory = "";
            snap.forEach((doc) => {
              setCategories(doc.data().categories);
              setActiveCategory(doc.data().categories[0]?.name);
              actCategory = doc.data().categories[0]?.name;
            });
            firebase
              .firestore()
              .collection("products")
              .get()
              .then((snap) => {
                var category = [];
                var series = [];
                var products = [];
                setProductSize(snap.size);
                snap.forEach((doc) => {
                  products.push(doc.data());
                  if (doc.data().category === actCategory) {
                    category.push(doc.data().title);
                    series.push(doc.data().sold);
                  }
                });
                setProducts(products);
                setOptions({
                  ...options,
                  xaxis: {
                    ...options.xaxis,
                    categories: category,
                  },
                });
                setSeries([
                  {
                    name: "Sold",
                    data: series,
                  },
                ]);
                firebase
                  .firestore()
                  .collection("orders")
                  .get()
                  .then((snap) => {
                    setOrderSize(snap.size);
                    firebase
                      .firestore()
                      .collection("orders")
                      .get()
                      .then((snap) => {
                        var sales = 0;
                        snap.docChanges().forEach((change) => {
                          if (change.doc.data().status?.includes(7)) {
                            sales += change.doc.data()?.total;
                          }
                        });
                        setSales(sales);
                        setLoading(false);
                      });
                  });
              });
          });
      });
  }, []);

  const handleDataChange = (category) => {
    setActiveCategory(category);
    var categories2 = [];
    var series = [];
    products.forEach((product) => {
      if (product.category === category) {
        categories2.push(product.title);
        series.push(product.sold);
      }
    });
    setOptions({
      ...options,
      xaxis: {
        ...options.xaxis,
        categories: categories2,
      },
    });
    setSeries([
      {
        name: "Sold",
        data: series,
      },
    ]);
  };

  return (
    <div className="dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="boxes">
            <div className="dataBox">
              <div className="body">
                <i className="fas fa-users"></i>
                <h3>Users</h3>
                <h2>{userSize}</h2>
              </div>
            </div>
            <div className="dataBox">
              <div className="body">
                <i className="fas fa-dolly-flatbed"></i>
                <h3>Products</h3>
                <h2>{productSize}</h2>
              </div>
            </div>
            <div className="dataBox">
              <div className="body">
                <i className="fas fa-clipboard-list"></i>
                <h3>Orders</h3>
                <h2>{orderSize}</h2>
              </div>
            </div>
            <div className="dataBox">
              <div className="body">
                <i className="fas fa-rupee-sign"></i>
                <h3>Sales</h3>
                <h2>{sales}</h2>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="chart_container">
              <Chart
                options={options}
                series={series}
                type="area"
                style={{ width: "90%" }}
                // width={400}
                height={340}
              />
              <div className="buttons">
                {categories.map((category, index) => (
                  <Button
                    variant={
                      category.name === activeCategory
                        ? "contained"
                        : "outlined"
                    }
                    fullWidth
                    size="small"
                    color="primary"
                    key={index}
                    onClick={() => handleDataChange(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="messages">
              <h3>Message Alerts</h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
