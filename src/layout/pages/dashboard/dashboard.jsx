import React from "react";
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
const Linechart = () => {
  const data = [
    {
      name: "January",
      CurrentYear: 4000,
      LastYear: 2400,
    },
    {
      name: "Feburary",
      CurrentYear: 3000,
      LastYear: 1398,
    },
    {
      name: "March",
      CurrentYear: 2000,
      LastYear: 9800,
    },
    {
      name: "April",
      CurrentYear: 2780,
      LastYear: 3908,
    },
    {
      name: "May",
      CurrentYear: 1890,
      LastYear: 4800,
    },
    {
      name: "June",
      CurrentYear: 2390,
      LastYear: 3800,
    },
  ];
  return (
    <div className="chartContainer">
      <h3 className="chartHeading">Sales Comparison</h3>
      <ResponsiveContainer width="90%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="LastYear"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="CurrentYear" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
const Barchart = () => {
  const data = [
    {
      name: "January",
      CurrentYear: 4000,
      LastYear: 2400,
      amt: 2400,
    },
    {
      name: "Feburary",
      CurrentYear: 3000,
      LastYear: 1398,
      amt: 2210,
    },
    {
      name: "March",
      CurrentYear: 2000,
      LastYear: 9800,
      amt: 2290,
    },
    {
      name: "April",
      CurrentYear: 2780,
      LastYear: 3908,
      amt: 2000,
    },
    {
      name: "May",
      CurrentYear: 1890,
      LastYear: 4800,
      amt: 2181,
    },
    {
      name: "June",
      CurrentYear: 2390,
      LastYear: 3800,
      amt: 2500,
    },
  ];
  return (
    <div className="chartContainer" style={{ margin: "70px 0" }}>
      <h3 className="chartHeading">Total Revenue</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="LastYear" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="CurrentYear" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

function Dashboard() {
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
            <Linechart />
            <Linechart />
          </div>
          <Barchart />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
