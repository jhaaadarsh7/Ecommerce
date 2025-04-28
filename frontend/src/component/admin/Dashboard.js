import React, { useEffect } from 'react';
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProduct } from '../../actions/productAction.js';
import { getAllOrders } from '../../actions/orderAction.js';
import { getAllUsers } from "../../actions/userAction.js";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  let outofStock = 0;
  products && products.forEach((item) => {
    if (item.stock === 0) {
      outofStock += 1;
    }
  });

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  if (!products || !orders || !users) {
    return <p>Loading...</p>; // Updated loading state to include users
  }

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: "tomato",
        hoverBackgroundColor: "rgb(197, 72, 49)",
        data: [0, 4599],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outofStock, products.length - outofStock],
      },
    ],
  };

  return (
    <div className='dashboard'>
      <Sidebar />
      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>
        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹ 2000
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Product</p>
              <p>{products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Users</p>
              <p>{users.length}</p>
            </Link>
          </div>
        </div>
        
        <div className="lineChart">
          <Line data={lineState} options={{ scales: { x: { type: 'category' }, y: { type: 'linear' } } }} />
        </div>
        
        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
