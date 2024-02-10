import React, { useEffect, useState } from "react";
import "./dashboard.css";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Chart from "react-apexcharts";

const RevenueInsights = () => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: "area",
      },
      stroke: {
        curve: "smooth",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#629072", "#629072", "#629072"],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["#629072", "#629072", "#629072"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 0.5,
        },
      },
      markers: {
        colors: ["#62907250", "#62907250", "#62907250"],
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
    },
    series: [
      {
        name: "Revenue",
        data: [30, 40, 50, 55, 65, 50],
      },
    ],
  });
  return (
    <div className="chartContainer">
      <h3 className="chartHeading">Revenue Insights</h3>
      <Chart
        options={state.options}
        series={state.series}
        type="area"
        width="500"
      />
    </div>
  );
};
const OrdersInsights = () => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: "area",
      },
      stroke: {
        curve: "smooth",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#89CFF0", "#89CFF0", "#89CFF0"],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["#89CFF0", "#89CFF0", "#89CFF0"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 0.5,
        },
      },
      markers: {
        colors: ["#89CFF050", "#89CFF050", "#89CFF050"],
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
    },
    series: [
      {
        name: "Orders",
        data: [30, 40, 50, 40, 35, 30],
      },
    ],
  });
  return (
    <div className="chartContainer">
      <h3 className="chartHeading">Orders Insights</h3>
      <Chart
        options={state.options}
        series={state.series}
        type="area"
        width="500"
      />
    </div>
  );
};

const CustomerGrowth = () => {
  const [state, setState] = useState({
    series: [
      {
        name: "Customer",
        data: [10, 41, 35, 51, 49, 62, 69],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#50C878"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Customer Growth by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#4f5059", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.4,
        },
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
    },
  });
  return (
    <div className="chartContainer">
      <h3 className="chartHeading" style={{ marginLeft: 10 }}>
        Customer Growth
      </h3>
      <Chart
        options={state.options}
        series={state.series}
        type="line"
        width="500"
      />
    </div>
  );
};

const ProductSold = () => {
  const [state, setState] = useState({
    series: [
      {
        name: "Products Sold",
        data: [10, 20, 30, 20, 49, 52, 69],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#E98F12"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Products Sold by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#4f5059", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.4,
        },
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
    },
  });
  return (
    <div className="chartContainer">
      <h3 className="chartHeading" style={{ marginLeft: 10 }}>
        Products Sold
      </h3>
      <Chart
        options={state.options}
        series={state.series}
        type="line"
        width="500"
      />
    </div>
  );
};
function Dashboard() {
  useEffect(() => {
    let el = document.getElementsByTagName("text");
    Array.from(el).forEach((item) => {
      item.setAttribute("fill", "#eee");
    });
    // console.log(el);
  }, []);
  return (
    <div className="dashboard">
      <div className="top">
        <div
          className="insightCard"
          style={{
            backgroundImage: "linear-gradient(45deg,#62907250 0%,#3ab263 100%",
          }}
        >
          <i class="fa-solid fa-dollar-sign"></i>
          <h3>$100k</h3>
          <p>Total Revenue</p>
        </div>
        <div
          className="insightCard"
          style={{
            backgroundImage: "linear-gradient(45deg,#3399ff50 0%,#2982cc 100%)",
          }}
        >
          <i class="fa-solid fa-tag"></i>
          <h3>150</h3>
          <p> Total Sales</p>
        </div>
        <div
          className="insightCard"
          style={{
            backgroundImage: "linear-gradient(45deg,#f9b11550 0%,#f6960b 100%)",
          }}
        >
          <i class="fa-solid fa-shirt"></i>
          <h3>250</h3>
          <p>Products</p>
        </div>
        <div
          className="insightCard"
          style={{
            backgroundImage: "linear-gradient(45deg,#e5535350 0%,#d93737 100%)",
          }}
        >
          <i class="fa-solid fa-user"></i>
          <h3>987</h3>
          <p>Users</p>
        </div>
        {/* <div className="insightCard" style={{ backgroundColor: "#FFE2E6" }}>
          <i class="fa-solid fa-tag"></i>
          <h3>150</h3>
          <p>Sales</p>
        </div> */}
      </div>
      <div className="bottom">
        <h2>INSIGHTS</h2>
        <div className="charts">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
            }}
          >
            <RevenueInsights />
            <OrdersInsights />
            <ProductSold />
            <CustomerGrowth />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
