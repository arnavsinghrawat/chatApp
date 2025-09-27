import axios from "axios";
import { useRouter } from "next/navigation";


export const publicApi = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_BACKEND_URI as string) || 'http://localhost:3001',
  headers: { "Content-Type": "application/json" },
});

export const privateApi = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_BACKEND_URI as string) || 'http://localhost:3001',
  headers: { "Content-Type": "application/json" },
});

privateApi.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("token");

  if (!token) {
    try {
      const response = await publicApi.post("/api/auth/refresh", {}, { withCredentials: true });
      token = response.data.token;
      localStorage.setItem("token", token!);
    } catch (err) {
      console.error("Failed to refresh access token", err);
      window.location.href = "/login";
      throw err;
    }
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

