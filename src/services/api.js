import axios from "axios";

let baseUrl;
if (process.env.NODE_ENV === "development") {
    baseUrl = process.env.VUE_APP_SERVER || "http://localhost:3000/api";
} else {
    baseUrl = process.env.BASE_URL + "api";
}

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