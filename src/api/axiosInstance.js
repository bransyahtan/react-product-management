import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Equivalent to credentials: 'include' in fetch
});

export default axiosInstance;
