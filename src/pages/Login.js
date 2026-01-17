import React, { useState, useContext } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/login", { email, password });
      const token = res.data.token;

      login(token); // store token in context and axios
      localStorage.setItem("adminToken", token); // persist token

      navigate("/MainPage"); // redirect to main page
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f2f5"
    }}>
      <form 
        onSubmit={handleLogin} 
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
          width: "320px",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#333" }}>Admin Control Panel</h2>

        {error && (
          <p style={{
            color: "red",
            marginBottom: "15px",
            fontSize: "14px"
          }}>{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px"
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4caf50",
            color: "#fff",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "0.2s all"
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#45a049"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#4caf50"}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
