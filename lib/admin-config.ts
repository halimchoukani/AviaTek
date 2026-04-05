import axios from "axios";
import { createJWT } from "./appwrite";

const adminApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_ADMIN_API,
    timeout: 10000,
});

adminApi.interceptors.request.use(async (config) => {
    try {
        const token = await createJWT();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error("Error setting Authorization header:", error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default adminApi;