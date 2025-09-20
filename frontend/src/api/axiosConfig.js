// src/api/axiosConfig.js
import axios from 'axios';

// Configure the base URL for all Axios requests
const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // Your backend API URL
  headers: {
    'Content-Type': 'application/json', // Default header
  },
});


apiClient.interceptors.request.use((config) => {
   const token = localStorage.getItem('token'); // Or get from AuthContext
   if (token) {
    config.headers.Authorization = `Bearer ${token}`;
   }
  return config;
 });

export default apiClient;