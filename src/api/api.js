import axios from "axios";

// Create an axios instance with your backend URL
const API = axios.create({
  baseURL: "https://prototype-xcoa.onrender.com", // your backend server
});

// Add admin token to all requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;


