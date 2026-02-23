import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5002";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach stored JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("at_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types returned from the API
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface License {
  id: string;
  key: string;
  plan: "monthly" | "annual";
  status: "inactive" | "active" | "expired" | "cancelled";
  activatedAt?: string;
  expiresAt?: string;
  machineId?: string;
  createdAt: string;
}
