import React, { useState, useContext } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // NEW
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    setError(""); // reset error

    try {
      const res = await API.post("/admin/login", { email, password });
      const token = res.data.token;

      login(token); // store token in context and axios
      localStorage.setItem("adminToken", token); // persist token

      navigate("/MainPage"); // redirect to main page
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#000000"
    }}>
      <form 
        onSubmit={handleLogin} 
        style={{
          backgroundColor: "#edd8d8",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
          width: "320px",
          textAlign: "center"
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#333" }}>CAFE NAME -Admin Control Panel</h2>

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
          disabled={loading} // disable button while loading
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4caf50",
            color: "#fff",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            transition: "0.2s all"
          }}
          onMouseEnter={(e) => { if(!loading) e.target.style.backgroundColor = "#45a049"; }}
          onMouseLeave={(e) => { if(!loading) e.target.style.backgroundColor = "#4caf50"; }}
        >
          {loading ? (
            <>
              {/* Spinner */}
              <div style={{
                border: "3px solid #ffffff",
                borderTop: "3px solid #4caf50",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                animation: "spin 1s linear infinite"
              }}></div>
              Authenticating...
            </>
          ) : "Login"}
        </button>

        {/* Spinner animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

      </form>
    </div>
  );
};

export default Login;
