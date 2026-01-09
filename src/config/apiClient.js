import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
    // Other default headers
  },
});

export default apiClient;
