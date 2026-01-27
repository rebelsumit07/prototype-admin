import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Confirm dialog
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div style={{
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: "#fff",
      padding: "25px",
      borderRadius: "10px",
      width: "320px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
      textAlign: "center"
    }}>
      <p>{message}</p>
      <div style={{ marginTop: "20px" }}>
        <button 
          onClick={onConfirm} 
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Yes
        </button>
        <button 
          onClick={onCancel} 
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          No
        </button>
      </div>
    </div>
  </div>
);

const MainPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getChartData = () => {
    const daysInMonth = new Date().getDate();
    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayOrders = orders.filter(
        o => new Date(o.createdAt).getDate() === i
      );
      data.push({
        day: i,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0)
      });
    }

    return data;
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", position: "relative" }}>
      {/* Logout button */}
      <button
        onClick={() => setConfirmLogout(true)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

      <h1 style={{ textAlign: "center", marginTop: "40px" }}>
        Admin Control Panel
      </h1>

      {/* Top buttons */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "40px",
        flexWrap: "wrap"
      }}>
        <button onClick={() => navigate("/dashboard")} style={buttonStyle}>
          Dashboard
        </button>

        <button onClick={() => navigate("/menu")} style={buttonStyle}>
          Menu
        </button>

        <button onClick={() => navigate("/add-edit-food")} style={buttonStyle}>
          Add/Edit Food
        </button>

        {/* ✅ ADDED BUTTON */}
        <button onClick={() => navigate("/admin/reservations")} style={buttonStyle}>
          Reservations
        </button>
      </div>

      {/* Chart */}
      <div style={{
        marginTop: "60px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        maxWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Orders This Month
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#4caf50" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {confirmLogout && (
        <ConfirmDialog
          message="Are you sure you want to logout?"
          onConfirm={handleLogout}
          onCancel={() => setConfirmLogout(false)}
        />
      )}
    </div>
  );
};

const buttonStyle = {
  padding: "15px 30px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#2196f3",
  color: "#fff",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
};

export default MainPage;
