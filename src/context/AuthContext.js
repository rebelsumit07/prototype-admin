import React, { createContext, useState } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setAuthToken] = useState(null);

  // Helper to set token in axios headers
  const setAPIToken = (token) => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
  };

  // Login: set token in state & axios
  const login = (newToken) => {
    setAuthToken(newToken);
    setAPIToken(newToken);
  };

  // Logout: remove token from state & axios
  const logout = () => {
    setAuthToken(null);
    setAPIToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
