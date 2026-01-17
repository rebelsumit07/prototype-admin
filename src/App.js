import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import AddEditFood from "./pages/AddEditFood";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default redirect to mainpage if logged in */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/add-edit-food" element={<AddEditFood />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
