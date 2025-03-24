import axios from "axios";

const api = axios.create({
  baseURL: "https://carpooll-backend.onrender.com/api",
  withCredentials: true,
});

export default api;
