import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{
      display: "flex",
      padding: "10px 20px",
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #ccc",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        <Link to="/dashboard" style={{ marginRight: "15px" }}>Orders</Link>
        <Link to="/menu">Menu</Link>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Navbar;
