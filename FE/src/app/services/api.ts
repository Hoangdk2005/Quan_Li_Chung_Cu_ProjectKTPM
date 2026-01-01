// api.ts
import axios from "axios";
import type { ApiClient } from "./ApiClient";

// Axios instance kết nối với Backend
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error("[API] Response error:", error.message);
    if (error.response) {
      console.error("[API] Status:", error.response.status);
      console.error("[API] Data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

// Adapter để axiosInstance khớp ApiClient
const axiosClient: ApiClient = {
  async get(url, config) { const res = await axiosInstance.get(url, config); return { data: res.data }; },
  async post(url, body, config) { const res = await axiosInstance.post(url, body, config); return { data: res.data }; },
  async put(url, body, config) { const res = await axiosInstance.put(url, body, config); return { data: res.data }; },
  async patch(url, body, config) { const res = await axiosInstance.patch(url, body, config); return { data: res.data }; },
  async delete(url, config) { const res = await axiosInstance.delete(url, config); return { data: res.data }; },
};

export const api: ApiClient = axiosClient;

