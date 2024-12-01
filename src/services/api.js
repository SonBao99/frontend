import axios from "axios";

const baseUrl = process.env.NODE_ENV === "development" 
    ? (process.env.VUE_APP_SERVER || "http://localhost:3000/api")
    : "https://backend-chih.onrender.com/api";

const api = axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Credentials": true
    },
    withCredentials: true
});

export default api;