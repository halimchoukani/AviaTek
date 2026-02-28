import axios from "axios";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_ADMIN_API,
    timeout: 10000,
});

export default api;