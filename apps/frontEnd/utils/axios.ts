import axios from "axios";


export const publicApi = axios.create({
    baseURL: process.env.BACKEND_URI || 'http://localhost:3001',
    headers: {"Content-Type": "application/json"},
});

export const privateApi = axios.create({
    baseURL: process.env.BACKEND_URI,
    headers: {"Content-Type": "application/json"},
});

privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
