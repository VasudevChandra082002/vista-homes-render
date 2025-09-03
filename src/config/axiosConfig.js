import axios from "axios";
const api = axios.create({
    baseURL:"https://real-estate-backend-ebon.vercel.app/",
  timeout: 30000, // Optional: Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;
