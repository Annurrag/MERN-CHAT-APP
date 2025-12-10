import axios from "axios";

// Base URL for your backend API
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// You can reuse the same URL for socket.io
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

// Pre-configured axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});
