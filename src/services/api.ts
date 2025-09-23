import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //USE ENV VARIABLES
  //baseURL: "https://sage-sync-backend.onrender.com/api/v1", //backend
  withCredentials: true, // ensures cookies are sent/received
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
