import axios from "axios";
const api = axios.create({
    baseURL:"http://localhost:4000/",
  timeout: 30000, // Optional: Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;
